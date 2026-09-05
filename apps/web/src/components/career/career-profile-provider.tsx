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

type CareerProfileStatus = "loading" | "ready" | "error";

interface CareerProfileContextValue {
  readonly profile: CareerProfile | null;
  readonly status: CareerProfileStatus;
  readonly saveProfile: (profile: CareerProfile) => Promise<void>;
  readonly replaceProfile: (profile: CareerProfile) => Promise<void>;
  readonly resetProfile: () => Promise<void>;
}

const CareerProfileContext = createContext<CareerProfileContextValue | null>(null);

export function CareerProfileProvider({
  children,
  storage,
}: Readonly<{ children: ReactNode; storage?: CareerStorage }>) {
  const storageRef = useRef<CareerStorage | null>(storage ?? null);
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [status, setStatus] = useState<CareerProfileStatus>("loading");

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

    setStatus("loading");
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

  const saveProfile = useCallback(
    async (nextProfile: CareerProfile) => {
      await requireStorage().save(nextProfile);
      setProfile(nextProfile);
      setStatus("ready");
    },
    [requireStorage],
  );

  const replaceProfile = useCallback(
    async (nextProfile: CareerProfile) => {
      await requireStorage().save(nextProfile);
      setProfile(nextProfile);
      setStatus("ready");
    },
    [requireStorage],
  );

  const resetProfile = useCallback(async () => {
    await requireStorage().clear();
    setProfile(null);
    setStatus("ready");
  }, [requireStorage]);

  const value = useMemo<CareerProfileContextValue>(
    () => ({ profile, status, saveProfile, replaceProfile, resetProfile }),
    [profile, status, saveProfile, replaceProfile, resetProfile],
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
