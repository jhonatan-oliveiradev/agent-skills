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
  createIndexedDbCareerStorage,
  type CareerStorage,
} from "@/lib/career/storage";
import type { CareerProfile } from "@/lib/career/types";

type CareerProfileStatus = "hydrating" | "ready" | "error";
type CareerProfileUpdater = (profile: CareerProfile) => CareerProfile;

interface CareerProfileContextValue {
  readonly profile: CareerProfile | null;
  readonly status: CareerProfileStatus;
  readonly replaceProfile: (profile: CareerProfile) => Promise<void>;
  readonly updateProfile: (updater: CareerProfileUpdater) => Promise<void>;
  readonly resetProfile: () => Promise<void>;
}

const CareerProfileContext = createContext<CareerProfileContextValue | null>(null);

export function CareerProfileProvider({
  children,
  storage,
}: Readonly<{ children: ReactNode; storage?: CareerStorage }>) {
  const storageRef = useRef<CareerStorage | null>(storage ?? null);
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [status, setStatus] = useState<CareerProfileStatus>("hydrating");

  useEffect(() => {
    let active = true;
    let resolvedStorage: CareerStorage;

    try {
      resolvedStorage = storage ?? storageRef.current ?? createIndexedDbCareerStorage();
      storageRef.current = resolvedStorage;
    } catch {
      setProfile(null);
      setStatus("error");
      return () => {
        active = false;
      };
    }

    setStatus("hydrating");
    void resolvedStorage
      .load()
      .then((storedProfile) => {
        if (!active) return;
        setProfile(storedProfile);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setProfile(null);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [storage]);

  const requireStorage = useCallback((): CareerStorage => {
    if (!storageRef.current) {
      throw new Error("Career Lab storage is not ready yet.");
    }
    return storageRef.current;
  }, []);

  const replaceProfile = useCallback(
    async (nextProfile: CareerProfile) => {
      await requireStorage().save(nextProfile);
      setProfile(nextProfile);
      setStatus("ready");
    },
    [requireStorage],
  );

  const updateProfile = useCallback(
    async (updater: CareerProfileUpdater) => {
      if (!profile) {
        throw new Error("Career Lab cannot update a profile before hydration completes.");
      }
      const nextProfile = updater(profile);
      await requireStorage().save(nextProfile);
      setProfile(nextProfile);
      setStatus("ready");
    },
    [profile, requireStorage],
  );

  const resetProfile = useCallback(async () => {
    await requireStorage().clear();
    setProfile(null);
    setStatus("ready");
  }, [requireStorage]);

  const value = useMemo<CareerProfileContextValue>(
    () => ({ profile, status, replaceProfile, updateProfile, resetProfile }),
    [profile, status, replaceProfile, updateProfile, resetProfile],
  );

  return <CareerProfileContext.Provider value={value}>{children}</CareerProfileContext.Provider>;
}

export function useCareerProfile(): CareerProfileContextValue {
  const context = useContext(CareerProfileContext);
  if (!context) {
    throw new Error("useCareerProfile must be used inside CareerProfileProvider");
  }
  return context;
}
