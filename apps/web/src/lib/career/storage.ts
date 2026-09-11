import { migrateCareerProfile } from "./migrations";
import { validateLearningProgressReferences } from "./learning-validation";
import { parseCareerProfile } from "./schema";
import type { CareerProfile } from "./types";

export const CAREER_STORAGE_KEY = "agent-skills:career-profile";
export const CAREER_DB_NAME = "agent-skills-career-lab";
export const CAREER_DB_VERSION = 1;
export const CAREER_STORE_NAME = "career-profile";

export interface CareerStorage {
  load(): Promise<CareerProfile | null>;
  save(profile: CareerProfile): Promise<void>;
  clear(): Promise<void>;
}

function cloneCareerProfile(profile: CareerProfile): CareerProfile {
  return parseCareerProfile(JSON.parse(JSON.stringify(profile)) as unknown);
}

function validateForStorage(profile: CareerProfile): CareerProfile {
  return validateLearningProgressReferences(parseCareerProfile(profile));
}

export function createMemoryCareerStorage(initial: CareerProfile | null = null): CareerStorage {
  let current = initial ? cloneCareerProfile(initial) : null;

  return {
    async load() {
      return current ? cloneCareerProfile(current) : null;
    },
    async save(profile) {
      const validated = validateForStorage(profile);
      current = cloneCareerProfile(validated);
    },
    async clear() {
      current = null;
    },
  };
}

function openCareerDatabase(indexedDB: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CAREER_DB_NAME, CAREER_DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Failed to open Career Lab storage"));
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(CAREER_STORE_NAME)) {
        database.createObjectStore(CAREER_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error ?? new Error("Career Lab storage request failed"));
    request.onsuccess = () => resolve(request.result);
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error ?? new Error("Career Lab storage transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("Career Lab storage transaction aborted"));
    transaction.oncomplete = () => resolve();
  });
}

export function createIndexedDbCareerStorage(indexedDB: IDBFactory): CareerStorage {
  return {
    async load() {
      const database = await openCareerDatabase(indexedDB);
      try {
        const transaction = database.transaction(CAREER_STORE_NAME, "readonly");
        const request = transaction.objectStore(CAREER_STORE_NAME).get(CAREER_STORAGE_KEY);
        const stored = await requestResult<unknown>(request);
        if (stored === undefined || stored === null) return null;
        return migrateCareerProfile(stored);
      } finally {
        database.close();
      }
    },
    async save(profile) {
      const validated = validateForStorage(profile);
      const database = await openCareerDatabase(indexedDB);
      try {
        const transaction = database.transaction(CAREER_STORE_NAME, "readwrite");
        transaction.objectStore(CAREER_STORE_NAME).put(validated, CAREER_STORAGE_KEY);
        await transactionComplete(transaction);
      } finally {
        database.close();
      }
    },
    async clear() {
      const database = await openCareerDatabase(indexedDB);
      try {
        const transaction = database.transaction(CAREER_STORE_NAME, "readwrite");
        transaction.objectStore(CAREER_STORE_NAME).delete(CAREER_STORAGE_KEY);
        await transactionComplete(transaction);
      } finally {
        database.close();
      }
    },
  };
}
