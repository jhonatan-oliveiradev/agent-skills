export const CAREER_GUIDANCE_STORAGE_KEY = "career-lab:guidance:v1";

export type OrientationStatus = "unseen" | "completed" | "skipped";

export type CareerGuidanceState = Readonly<{
  orientationStatus: OrientationStatus;
}>;

export interface CareerGuidanceStorage {
  load(): Promise<CareerGuidanceState>;
  save(state: CareerGuidanceState): Promise<void>;
}

type GuidanceWebStorage = Pick<Storage, "getItem" | "setItem">;

const UNSEEN_GUIDANCE_STATE: CareerGuidanceState = {
  orientationStatus: "unseen",
};

function parseGuidanceState(value: string | null): CareerGuidanceState {
  if (value === null) return UNSEEN_GUIDANCE_STATE;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return UNSEEN_GUIDANCE_STATE;

    const orientationStatus = (parsed as { orientationStatus?: unknown }).orientationStatus;
    if (
      orientationStatus === "unseen" ||
      orientationStatus === "completed" ||
      orientationStatus === "skipped"
    ) {
      return { orientationStatus };
    }
  } catch {
    return UNSEEN_GUIDANCE_STATE;
  }

  return UNSEEN_GUIDANCE_STATE;
}

function resolveGuidanceWebStorage(storage?: GuidanceWebStorage): GuidanceWebStorage {
  if (storage) return storage;
  if (typeof window === "undefined") {
    throw new Error("Career Lab guidance storage is only available in the browser.");
  }
  return window.localStorage;
}

export function createBrowserCareerGuidanceStorage(
  storage?: GuidanceWebStorage,
): CareerGuidanceStorage {
  const webStorage = resolveGuidanceWebStorage(storage);

  return {
    async load() {
      return parseGuidanceState(webStorage.getItem(CAREER_GUIDANCE_STORAGE_KEY));
    },
    async save(state) {
      webStorage.setItem(CAREER_GUIDANCE_STORAGE_KEY, JSON.stringify(state));
    },
  };
}
