import { WorkerProfile, Review } from '../types';
import { INITIAL_PROFILES, INITIAL_PENDING_PROFILES } from '../data/initialData';

const STORAGE_KEY_PROFILES = 'titiktemu_active_profiles_v2';
const STORAGE_KEY_PENDING = 'titiktemu_pending_profiles_v2';
const STORAGE_KEY_PROCESSED_PENDING = 'titiktemu_processed_pending_v2';
const STORAGE_KEY_TRASH = 'titiktemu_trash_profiles_v2';
const STORAGE_KEY_FAVORITES = 'titiktemu_user_favorites_v1';
const STORAGE_KEY_ADMIN_AUTH = 'titiktemu_admin_session_v1';

export function getActiveProfiles(): WorkerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Check if new default profiles (like Muhammad Alif Murti) are missing in stored array
      const existingIds = new Set(parsed.map((p: WorkerProfile) => p.id));
      const missingInitial = INITIAL_PROFILES.filter((ip) => !existingIds.has(ip.id));
      if (missingInitial.length > 0) {
        // Prepend missing default profiles to the front
        const merged = [...missingInitial, ...parsed];
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return INITIAL_PROFILES;
  } catch (e) {
    console.error('Error loading active profiles', e);
    return INITIAL_PROFILES;
  }
}

export function saveActiveProfiles(profiles: WorkerProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.warn('LocalStorage quota exceeded on active profiles. Saving compact version...', e);
    try {
      const compact = profiles.map(p => ({
        ...p,
        workOutputs: p.workOutputs?.map(w => {
          if (w.url && w.url.startsWith('data:') && w.url.length > 50000) {
            return { ...w, url: w.url.substring(0, 100) + '...[compact]' };
          }
          return w;
        })
      }));
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(compact));
    } catch (e2) {
      console.error('Cannot save even compact active profiles to localStorage', e2);
    }
  }
}

// In-memory fallback and cache to ensure submissions are NEVER lost due to localStorage quota
let memoryPendingCache: WorkerProfile[] | null = null;

function markPendingProcessed(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROCESSED_PENDING);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEY_PROCESSED_PENDING, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Error saving processed pending id', e);
  }
}

export function getPendingProfiles(): WorkerProfile[] {
  let fromStorage: WorkerProfile[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING);
    if (raw) {
      fromStorage = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error loading pending profiles from localStorage', e);
  }

  let processedIds: string[] = [];
  try {
    const rawProcessed = localStorage.getItem(STORAGE_KEY_PROCESSED_PENDING);
    if (rawProcessed) processedIds = JSON.parse(rawProcessed);
  } catch (e) {
    console.warn('Error loading processed IDs', e);
  }

  const mergedMap = new Map<string, WorkerProfile>();

  // Ensure default pending submissions (like Muhammad Alif Murti) are displayed unless already approved/rejected
  INITIAL_PENDING_PROFILES.forEach((p) => {
    if (!processedIds.includes(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  fromStorage.forEach((p) => {
    if (!processedIds.includes(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  if (memoryPendingCache) {
    memoryPendingCache.forEach((p) => {
      if (!processedIds.includes(p.id)) {
        mergedMap.set(p.id, p);
      }
    });
  }

  return Array.from(mergedMap.values());
}

export function savePendingProfiles(profiles: WorkerProfile[]): void {
  // Always update in-memory cache first
  memoryPendingCache = profiles;

  try {
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(profiles));
  } catch (e) {
    console.warn('LocalStorage quota exceeded on pending profiles. Saving compact version...', e);
    try {
      const compactProfiles = profiles.map(p => ({
        ...p,
        workOutputs: p.workOutputs?.map(w => {
          if (w.url && w.url.startsWith('data:') && w.url.length > 50000) {
            return {
              ...w,
              url: w.url.substring(0, 100) + '...[compact]'
            };
          }
          return w;
        })
      }));
      localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(compactProfiles));
    } catch (e2) {
      console.error('Failed to save compact pending profiles to localStorage', e2);
    }
  }
}

export function submitNewPendingProfile(profileData: Omit<WorkerProfile, 'id' | 'status' | 'submittedAt' | 'whatsappClicks' | 'viewsCount' | 'rating' | 'reviewCount' | 'reviews'>): WorkerProfile {
  const newProfile: WorkerProfile = {
    ...profileData,
    id: `submit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    submittedAt: new Date().toISOString().split('T')[0],
    whatsappClicks: 0,
    viewsCount: 0,
    rating: 5.0,
    reviewCount: 0,
    reviews: []
  };

  const currentPending = getPendingProfiles();
  const updated = [newProfile, ...currentPending.filter(p => p.id !== newProfile.id)];
  savePendingProfiles(updated);
  return newProfile;
}

export function approvePendingProfile(profileId: string): void {
  markPendingProcessed(profileId);
  const pending = getPendingProfiles();
  const target = pending.find(p => p.id === profileId);
  if (!target) return;

  const updatedPending = pending.filter(p => p.id !== profileId);
  savePendingProfiles(updatedPending);

  const active = getActiveProfiles();
  const activatedProfile: WorkerProfile = {
    ...target,
    status: 'active',
    verified: true
  };
  saveActiveProfiles([activatedProfile, ...active]);
}

export function getTrashProfiles(): WorkerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRASH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error loading trash profiles from localStorage', e);
  }
  return [];
}

export function saveTrashProfiles(profiles: WorkerProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRASH, JSON.stringify(profiles));
  } catch (e) {
    console.warn('LocalStorage quota exceeded on trash profiles', e);
  }
}

export function moveToTrash(profile: WorkerProfile): void {
  const trash = getTrashProfiles();
  const updated = [{ ...profile, status: 'rejected' as const }, ...trash.filter(p => p.id !== profile.id)];
  saveTrashProfiles(updated);
}

export function restoreProfileFromTrash(profileId: string, directPublish: boolean = true): void {
  const trash = getTrashProfiles();
  const target = trash.find(p => p.id === profileId);
  if (!target) return;

  // Remove from trash
  saveTrashProfiles(trash.filter(p => p.id !== profileId));

  if (directPublish) {
    const active = getActiveProfiles();
    const restored: WorkerProfile = {
      ...target,
      status: 'active',
      verified: true
    };
    saveActiveProfiles([restored, ...active.filter(p => p.id !== profileId)]);
  } else {
    const pending = getPendingProfiles();
    const restored: WorkerProfile = {
      ...target,
      status: 'pending'
    };
    savePendingProfiles([restored, ...pending.filter(p => p.id !== profileId)]);
  }
}

export function deletePermanentlyFromTrash(profileId: string): void {
  const trash = getTrashProfiles();
  saveTrashProfiles(trash.filter(p => p.id !== profileId));
}

export function emptyTrash(): void {
  saveTrashProfiles([]);
}

export function rejectPendingProfile(profileId: string): void {
  markPendingProcessed(profileId);
  const pending = getPendingProfiles();
  const target = pending.find(p => p.id === profileId);
  const updatedPending = pending.filter(p => p.id !== profileId);
  savePendingProfiles(updatedPending);

  if (target) {
    moveToTrash(target);
  }
}

export function addActiveProfile(profileData: Omit<WorkerProfile, 'id' | 'status' | 'submittedAt' | 'whatsappClicks' | 'viewsCount'>): WorkerProfile {
  const newProfile: WorkerProfile = {
    ...profileData,
    id: `wk-${Date.now()}`,
    status: 'active',
    submittedAt: new Date().toISOString().split('T')[0],
    whatsappClicks: 0,
    viewsCount: 0
  };

  const active = getActiveProfiles();
  saveActiveProfiles([newProfile, ...active]);
  return newProfile;
}

export function updateActiveProfile(profile: WorkerProfile): void {
  const active = getActiveProfiles();
  const index = active.findIndex(p => p.id === profile.id);
  if (index !== -1) {
    active[index] = profile;
    saveActiveProfiles([...active]);
  }
}

export function deleteActiveProfile(profileId: string): void {
  const active = getActiveProfiles();
  const target = active.find(p => p.id === profileId);
  const filtered = active.filter(p => p.id !== profileId);
  saveActiveProfiles(filtered);

  if (target) {
    moveToTrash(target);
  }
}

export function incrementWhatsappClick(profileId: string): void {
  const active = getActiveProfiles();
  const target = active.find(p => p.id === profileId);
  if (target) {
    target.whatsappClicks = (target.whatsappClicks || 0) + 1;
    saveActiveProfiles([...active]);
  }
}

export function incrementViewCount(profileId: string): void {
  const active = getActiveProfiles();
  const target = active.find(p => p.id === profileId);
  if (target) {
    target.viewsCount = (target.viewsCount || 0) + 1;
    saveActiveProfiles([...active]);
  }
}

export function addReviewToProfile(profileId: string, review: Omit<Review, 'id' | 'date'>): void {
  const active = getActiveProfiles();
  const target = active.find(p => p.id === profileId);
  if (target) {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    target.reviews = [newRev, ...(target.reviews || [])];
    target.reviewCount = target.reviews.length;
    const sum = target.reviews.reduce((acc, r) => acc + r.rating, 0);
    target.rating = Number((sum / target.reviewCount).toFixed(2));
    saveActiveProfiles([...active]);
  }
}

// User favorites
export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(profileId: string): boolean {
  const favs = getFavorites();
  const exists = favs.includes(profileId);
  let updated: string[];
  if (exists) {
    updated = favs.filter(id => id !== profileId);
  } else {
    updated = [...favs, profileId];
  }
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  return !exists;
}

// Admin Auth
export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
}

export function setAdminLogin(isLoggedIn: boolean): void {
  if (isLoggedIn) {
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  }
}

// Reset data to initial defaults
export function resetProfilesToDefault(): void {
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_PROFILES));
  localStorage.removeItem(STORAGE_KEY_PENDING);
}

// Format IDR currency
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
