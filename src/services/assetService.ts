import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ASSET_COLLECTION = 'profileAssets';
const DB_NAME = 'titiktemu_offline_assets_db';
const STORE_NAME = 'media_assets';

// In-memory cache for fast access
const memoryAssetCache = new Map<string, string>();

/**
 * Open or initialize browser IndexedDB for storing PDFs and media assets.
 * Native IndexedDB has no 5MB limit and is shared across ALL browser tabs on the same domain (Vercel).
 */
function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAssetToIndexedDb(id: string, dataUrl: string, fileName?: string): Promise<void> {
  try {
    memoryAssetCache.set(id, dataUrl);
    const database = await openIndexedDb();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, dataUrl, fileName, timestamp: Date.now() });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB save notice', err);
  }
}

export async function getAssetFromIndexedDb(id: string): Promise<string | null> {
  if (memoryAssetCache.has(id)) {
    return memoryAssetCache.get(id) || null;
  }
  try {
    const database = await openIndexedDb();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    return new Promise((resolve) => {
      req.onsuccess = () => {
        const val = req.result ? req.result.dataUrl : null;
        if (val) memoryAssetCache.set(id, val);
        resolve(val);
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Save an asset (PDF or photo) to both local IndexedDB (shared across all tabs on Vercel)
 * and Firebase Cloud Firestore /profileAssets/{assetId} (for external mobile/desktop devices).
 */
export async function saveAsset(
  id: string,
  dataUrl: string,
  fileName?: string,
  profileId?: string
): Promise<void> {
  // 1. Store in memory and IndexedDB (guarantees cross-tab access on Vercel without quota error)
  await saveAssetToIndexedDb(id, dataUrl, fileName);

  // 2. Store in Firestore dedicated document if under Firestore's 1MB payload limit
  try {
    if (dataUrl.length < 900000) {
      const assetRef = doc(db, ASSET_COLLECTION, id);
      await setDoc(
        assetRef,
        {
          id,
          dataUrl,
          fileName: fileName || 'file',
          profileId: profileId || '',
          updatedAt: Date.now()
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn('Notice: Asset cloud sync', err);
  }
}

/**
 * Retrieve asset from Memory, IndexedDB, or Firestore Cloud.
 */
export async function getAsset(id: string): Promise<string | null> {
  if (memoryAssetCache.has(id)) {
    return memoryAssetCache.get(id) || null;
  }

  // 1. Try local IndexedDB
  const local = await getAssetFromIndexedDb(id);
  if (local) {
    memoryAssetCache.set(id, local);
    return local;
  }

  // 2. Try Firestore Cloud
  try {
    const snap = await getDoc(doc(db, ASSET_COLLECTION, id));
    if (snap.exists()) {
      const data = snap.data();
      if (data?.dataUrl) {
        memoryAssetCache.set(id, data.dataUrl);
        saveAssetToIndexedDb(id, data.dataUrl, data.fileName).catch(() => {});
        return data.dataUrl;
      }
    }
  } catch (err) {
    console.warn('Error fetching asset from cloud', err);
  }

  return null;
}
