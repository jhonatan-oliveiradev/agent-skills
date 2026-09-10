"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createBrowserCareerGuidanceStorage,
  type CareerGuidanceStorage,
  type OrientationStatus,
} from "@/lib/career/guidance-storage";
import { useCareerProfile } from "./career-profile-provider";

type CareerGuidanceStatus = "hydrating" | "ready" | "error";

interface CareerGuidanceContextValue {
  readonly status: CareerGuidanceStatus;
  readonly orientationStatus: OrientationStatus;
  readonly isOrientationOpen: boolean;
  readonly openOrientation: () => void;
  readonly completeOrientation: () => Promise<void>;
  readonly skipOrientation: () => Promise<void>;
  readonly closeOrientation: () => void;
}

const CareerGuidanceContext = createContext<CareerGuidanceContextValue | null>(null);

export function CareerGuidanceProvider({
  children,
  storage,
}: Readonly<{ children: ReactNode; storage?: CareerGuidanceStorage }>) {
  const { profile, status: profileStatus } = useCareerProfile();
  const storageRef = useRef<CareerGuidanceStorage | null>(storage ?? null);
  const autoOpenedRef = useRef(false);
  const [status, setStatus] = useState<CareerGuidanceStatus>("hydrating");
  const [orientationStatus, setOrientationStatus] = useState<OrientationStatus>("unseen");
  const [isOrientationOpen, setOrientationOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      await Promise.resolve();

      try {
        const resolvedStorage =
          storage ?? storageRef.current ?? createBrowserCareerGuidanceStorage();
        storageRef.current = resolvedStorage;
        const state = await resolvedStorage.load();
        if (!active) return;
        setOrientationStatus(state.orientationStatus);
        setStatus("ready");
      } catch {
        if (!active) return;
        setOrientationStatus("unseen");
        setStatus("error");
      }
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, [storage]);

  useEffect(() => {
    if (
      status !== "ready" ||
      profileStatus !== "ready" ||
      !profile ||
      orientationStatus !== "unseen" ||
      autoOpenedRef.current
    ) {
      return;
    }

    autoOpenedRef.current = true;
    setOrientationOpen(true);
  }, [orientationStatus, profile, profileStatus, status]);

  const requireStorage = useCallback((): CareerGuidanceStorage => {
    if (!storageRef.current) {
      throw new Error("Career Lab guidance storage is not ready yet.");
    }
    return storageRef.current;
  }, []);

  const persistOrientationStatus = useCallback(
    async (nextStatus: Exclude<OrientationStatus, "unseen">) => {
      try {
        await requireStorage().save({ orientationStatus: nextStatus });
        setOrientationStatus(nextStatus);
        setOrientationOpen(false);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
        throw error;
      }
    },
    [requireStorage],
  );

  const openOrientation = useCallback(() => setOrientationOpen(true), []);
  const closeOrientation = useCallback(() => setOrientationOpen(false), []);
  const completeOrientation = useCallback(
    () => persistOrientationStatus("completed"),
    [persistOrientationStatus],
  );
  const skipOrientation = useCallback(
    () => persistOrientationStatus("skipped"),
    [persistOrientationStatus],
  );

  const value = useMemo<CareerGuidanceContextValue>(
    () => ({
      status,
      orientationStatus,
      isOrientationOpen,
      openOrientation,
      completeOrientation,
      skipOrientation,
      closeOrientation,
    }),
    [
      status,
      orientationStatus,
      isOrientationOpen,
      openOrientation,
      completeOrientation,
      skipOrientation,
      closeOrientation,
    ],
  );

  if (status === "hydrating") return null;

  return <CareerGuidanceContext.Provider value={value}>{children}</CareerGuidanceContext.Provider>;
}

export function useCareerGuidance(): CareerGuidanceContextValue {
  const context = useContext(CareerGuidanceContext);
  if (!context) {
    throw new Error("useCareerGuidance must be used inside CareerGuidanceProvider");
  }
  return context;
}

export function useOptionalCareerGuidance(): CareerGuidanceContextValue | null {
  return useContext(CareerGuidanceContext);
}
