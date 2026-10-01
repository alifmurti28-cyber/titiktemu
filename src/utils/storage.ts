import { WorkerProfile, Review } from '../types';
import { INITIAL_PROFILES } from '../data/initialData';

const STORAGE_KEY_PROFILES = 'titiktemu_active_profiles_v1';
const STORAGE_KEY_PENDING = 'titiktemu_pending_profiles_v1';
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
      // Check if new default profiles (like kuliner) are missing in stored array
      const existingIds = new Set(parsed.map((p: WorkerProfile) => p.id));
      const missingInitial = INITIAL_PROFILES.filter((ip) => !existingIds.has(ip.id));
      if (missingInitial.length > 0) {
        const merged = [...parsed, ...missingInitial];
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
    console.error('Error saving active profiles', e);
  }
}

export function getPendingProfiles(): WorkerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading pending profiles', e);
    return [];
  }
}

export function savePendingProfiles(profiles: WorkerProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving pending profiles', e);
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
  const updated = [newProfile, ...currentPending];
  savePendingProfiles(updated);
  return newProfile;
}

export function approvePendingProfile(profileId: string): void {
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

export function rejectPendingProfile(profileId: string): void {
  const pending = getPendingProfiles();
  const updatedPending = pending.filter(p => p.id !== profileId);
  savePendingProfiles(updatedPending);
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
  const filtered = active.filter(p => p.id !== profileId);
  saveActiveProfiles(filtered);
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
