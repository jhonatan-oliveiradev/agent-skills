import { migrateCareerProfile } from "./migrations";
import { parseCareerProfile } from "./schema";
import type { CareerProfile } from "./types";

export const CAREER_DB_NAME = "agent-skills-career-lab";
export const CAREER_DB_VERSION = 1;
export const CAREER_STORE_NAME = "career-profile";
export const ACTIVE_CAREER_PROFILE_KEY = "active";

export interface CareerStorage {
  load(): Promise<CareerProfile | null>;
  save(profile: CareerProfile): Promise<void>;
  clear(): Promise<void>;
}

function cloneCareerProfile(profile: CareerProfile): CareerProfile {
  return parseCareerProfile(JSON.parse(JSON.stringify(profile)) as unknown);
}

export function createMemoryCareerStorage(): CareerStorage {
  let current: CareerProfile | null = null;

  return {
    async load() {
      return current === null ? null : cloneCareerProfile(current);
    },
    async save(profile) {
      const parsed = parseCareerProfile(profile);
      current = cloneCareerProfile(parsed);
    },
    async clear() {
      current = null;
    },
  };
}

function resolveIndexedDbFactory(factory?: IDBFactory): IDBFactory {
  if (factory) return factory;
  if (typeof globalThis.indexedDB === "undefined") {
    throw new Error(
      "Career Lab storage is unavailable because this environment does not provide IndexedDB.",
    );
  }
  return globalThis.indexedDB;
}

function openCareerDatabase(factory: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = factory.open(CAREER_DB_NAME, CAREER_DB_VERSION);
    } catch (error) {
      reject(
        new Error("Unable to open Career Lab IndexedDB storage.", {
          cause: error,
        }),
      );
      return;
    }

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(CAREER_STORE_NAME)) {
        database.createObjectStore(CAREER_STORE_NAME);
      }
    };

    request.onerror = () => {
      reject(
        new Error("Unable to open Career Lab IndexedDB storage.", {
          cause: request.error,
        }),
      );
    };

    request.onblocked = () => {
      reject(
        new Error(
          "Career Lab storage upgrade is blocked by another open browser tab. Close the other tab and try again.",
        ),
      );
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
  });
}

function readActiveProfile(database: IDBDatabase): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(CAREER_STORE_NAME, "readonly");
    const request = transaction.objectStore(CAREER_STORE_NAME).get(ACTIVE_CAREER_PROFILE_KEY);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(
        new Error("Unable to read the active Career Profile from IndexedDB.", {
          cause: request.error,
        }),
      );
    };
    transaction.onabort = () => {
      reject(
        new Error("Career Profile read transaction was aborted.", {
          cause: transaction.error,
        }),
      );
    };
  });
}

function writeActiveProfile(database: IDBDatabase, profile: CareerProfile): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(CAREER_STORE_NAME, "readwrite");
    transaction.objectStore(CAREER_STORE_NAME).put(profile, ACTIVE_CAREER_PROFILE_KEY);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      reject(
        new Error("Unable to save the active Career Profile to IndexedDB.", {
          cause: transaction.error,
        }),
      );
    };
    transaction.onabort = () => {
      reject(
        new Error("Career Profile save transaction was aborted.", {
          cause: transaction.error,
        }),
      );
    };
  });
}

function deleteActiveProfile(database: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(CAREER_STORE_NAME, "readwrite");
    transaction.objectStore(CAREER_STORE_NAME).delete(ACTIVE_CAREER_PROFILE_KEY);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      reject(
        new Error("Unable to clear the active Career Profile from IndexedDB.", {
          cause: transaction.error,
        }),
      );
    };
    transaction.onabort = () => {
      reject(
        new Error("Career Profile clear transaction was aborted.", {
          cause: transaction.error,
        }),
      );
    };
  });
}

export function createIndexedDbCareerStorage(factory?: IDBFactory): CareerStorage {
  const indexedDb = resolveIndexedDbFactory(factory);

  return {
    async load() {
      const database = await openCareerDatabase(indexedDb);
      try {
        const stored = await readActiveProfile(database);
        if (stored === undefined || stored === null) return null;
        return migrateCareerProfile(stored);
      } finally {
        database.close();
      }
    },
    async save(profile) {
      // Validate before opening a write transaction so malformed imports can never
      // replace a previously valid local profile.
      const parsed = parseCareerProfile(profile);
      const database = await openCareerDatabase(indexedDb);
      try {
        await writeActiveProfile(database, parsed);
      } finally {
        database.close();
      }
    },
    async clear() {
      const database = await openCareerDatabase(indexedDb);
      try {
        // Delete only the Career Lab's active profile key. Do not clear the store
        // or touch any other browser storage owned by the Studio.
        await deleteActiveProfile(database);
      } finally {
        database.close();
      }
    },
  };
}
