import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { WorkerProfile, Review } from '../types';
import { INITIAL_PROFILES, INITIAL_PENDING_PROFILES } from '../data/initialData';

const ACTIVE_COLLECTION = 'activeProfiles';
const PENDING_COLLECTION = 'pendingProfiles';
const TRASH_COLLECTION = 'trashProfiles';

let isSeeding = false;

/**
 * Seed initial profiles to Firestore if the activeProfiles collection is empty.
 */
export async function seedInitialProfilesIfEmpty(): Promise<void> {
  if (isSeeding) return;
  try {
    const snap = await getDocs(collection(db, ACTIVE_COLLECTION));
    if (snap.empty) {
      isSeeding = true;
      const batch = writeBatch(db);
      for (const profile of INITIAL_PROFILES) {
        const ref = doc(db, ACTIVE_COLLECTION, profile.id);
        batch.set(ref, profile);
      }
      for (const pending of INITIAL_PENDING_PROFILES) {
        const ref = doc(db, PENDING_COLLECTION, pending.id);
        batch.set(ref, pending);
      }
      await batch.commit();
    } else {
      // Ensure user profile (wk-alif-murti) is present in cloud activeProfiles
      const userRef = doc(db, ACTIVE_COLLECTION, 'wk-alif-murti');
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const alifProfile = INITIAL_PROFILES.find(p => p.id === 'wk-alif-murti');
        if (alifProfile) {
          await setDoc(userRef, alifProfile);
        }
      }
    }
  } catch (error) {
    console.warn('Notice: Firestore initial sync/seed fallback', error);
  } finally {
    isSeeding = false;
  }
}

/**
 * Subscribe to real-time active profiles in Firestore
 */
export function subscribeToActiveProfiles(
  callback: (profiles: WorkerProfile[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  // Ensure default seeds exist
  seedInitialProfilesIfEmpty();

  const colRef = collection(db, ACTIVE_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as WorkerProfile);
        // Sort so verified & featured are top, and newly submitted first
        list.sort((a, b) => {
          if (a.id === 'wk-alif-murti') return -1;
          if (b.id === 'wk-alif-murti') return 1;
          return 0;
        });
        callback(list);
      } else {
        // Fallback to initial while seeding
        callback(INITIAL_PROFILES);
      }
    },
    (error) => {
      console.warn('Firestore activeProfiles subscription error, falling back to local', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, ACTIVE_COLLECTION);
    }
  );
}

/**
 * Subscribe to pending profiles in Firestore
 */
export function subscribeToPendingProfiles(
  callback: (profiles: WorkerProfile[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, PENDING_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as WorkerProfile);
      callback(list);
    },
    (error) => {
      console.warn('Firestore pendingProfiles subscription error', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, PENDING_COLLECTION);
    }
  );
}

/**
 * Subscribe to trash profiles in Firestore
 */
export function subscribeToTrashProfiles(
  callback: (profiles: WorkerProfile[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, TRASH_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as WorkerProfile);
      callback(list);
    },
    (error) => {
      console.warn('Firestore trashProfiles subscription error', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, TRASH_COLLECTION);
    }
  );
}

/**
 * Submit a new profile registration from public form into Firestore
 */
export async function submitPendingProfileCloud(
  profileData: Omit<WorkerProfile, 'id' | 'status' | 'submittedAt' | 'whatsappClicks' | 'viewsCount' | 'rating' | 'reviewCount' | 'reviews'>
): Promise<WorkerProfile> {
  const newId = `submit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newProfile: WorkerProfile = {
    ...profileData,
    id: newId,
    status: 'pending',
    submittedAt: new Date().toISOString().split('T')[0],
    whatsappClicks: 0,
    viewsCount: 0,
    rating: 5.0,
    reviewCount: 0,
    reviews: []
  };

  try {
    const docRef = doc(db, PENDING_COLLECTION, newId);
    await setDoc(docRef, newProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PENDING_COLLECTION}/${newId}`);
  }

  return newProfile;
}

/**
 * Approve a pending profile: Move from pendingProfiles to activeProfiles in Firestore
 */
export async function approvePendingProfileCloud(profileId: string): Promise<void> {
  try {
    const pendingRef = doc(db, PENDING_COLLECTION, profileId);
    const snap = await getDoc(pendingRef);

    let profileData: WorkerProfile | null = null;
    if (snap.exists()) {
      profileData = snap.data() as WorkerProfile;
    } else {
      // Check fallback from INITIAL_PENDING_PROFILES if it was a default pending
      const foundInInitial = INITIAL_PENDING_PROFILES.find((p) => p.id === profileId);
      if (foundInInitial) {
        profileData = foundInInitial;
      }
    }

    if (!profileData) {
      console.warn('Target profile not found for approval:', profileId);
      return;
    }

    const activatedProfile: WorkerProfile = {
      ...profileData,
      status: 'active',
      verified: true
    };

    const batch = writeBatch(db);
    batch.set(doc(db, ACTIVE_COLLECTION, profileId), activatedProfile);
    batch.delete(pendingRef);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ACTIVE_COLLECTION}/${profileId}`);
  }
}

/**
 * Reject a pending profile: Move from pendingProfiles to trashProfiles in Firestore
 */
export async function rejectPendingProfileCloud(profileId: string): Promise<void> {
  try {
    const pendingRef = doc(db, PENDING_COLLECTION, profileId);
    const snap = await getDoc(pendingRef);

    let profileData: WorkerProfile | null = null;
    if (snap.exists()) {
      profileData = snap.data() as WorkerProfile;
    } else {
      const found = INITIAL_PENDING_PROFILES.find((p) => p.id === profileId);
      if (found) profileData = found;
    }

    if (!profileData) return;

    const trashedProfile: WorkerProfile = {
      ...profileData,
      status: 'rejected'
    };

    const batch = writeBatch(db);
    batch.set(doc(db, TRASH_COLLECTION, profileId), trashedProfile);
    batch.delete(pendingRef);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TRASH_COLLECTION}/${profileId}`);
  }
}

/**
 * Update an active profile (e.g. self-edit with PIN or Admin edit) in Firestore
 */
export async function updateActiveProfileCloud(profile: WorkerProfile): Promise<void> {
  try {
    const docRef = doc(db, ACTIVE_COLLECTION, profile.id);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ACTIVE_COLLECTION}/${profile.id}`);
  }
}

/**
 * Delete an active profile and move to trash in Firestore
 */
export async function deleteActiveProfileCloud(profileId: string): Promise<void> {
  try {
    const activeRef = doc(db, ACTIVE_COLLECTION, profileId);
    const snap = await getDoc(activeRef);
    if (!snap.exists()) return;

    const profileData = snap.data() as WorkerProfile;
    const trashed: WorkerProfile = {
      ...profileData,
      status: 'rejected'
    };

    const batch = writeBatch(db);
    batch.set(doc(db, TRASH_COLLECTION, profileId), trashed);
    batch.delete(activeRef);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ACTIVE_COLLECTION}/${profileId}`);
  }
}

/**
 * Restore profile from trash in Firestore
 */
export async function restoreProfileFromTrashCloud(profileId: string, directPublish: boolean = true): Promise<void> {
  try {
    const trashRef = doc(db, TRASH_COLLECTION, profileId);
    const snap = await getDoc(trashRef);
    if (!snap.exists()) return;

    const profileData = snap.data() as WorkerProfile;
    const batch = writeBatch(db);

    if (directPublish) {
      const restored: WorkerProfile = {
        ...profileData,
        status: 'active',
        verified: true
      };
      batch.set(doc(db, ACTIVE_COLLECTION, profileId), restored);
    } else {
      const restored: WorkerProfile = {
        ...profileData,
        status: 'pending'
      };
      batch.set(doc(db, PENDING_COLLECTION, profileId), restored);
    }

    batch.delete(trashRef);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TRASH_COLLECTION}/${profileId}`);
  }
}

/**
 * Permanently delete from trash
 */
export async function deletePermanentlyFromTrashCloud(profileId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TRASH_COLLECTION, profileId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${TRASH_COLLECTION}/${profileId}`);
  }
}

/**
 * Empty entire trash collection
 */
export async function emptyTrashCloud(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, TRASH_COLLECTION));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, TRASH_COLLECTION);
  }
}

/**
 * Add review to profile in Firestore
 */
export async function addReviewCloud(profileId: string, review: Review): Promise<void> {
  try {
    const profileRef = doc(db, ACTIVE_COLLECTION, profileId);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) return;

    const profile = snap.data() as WorkerProfile;
    const reviews = profile.reviews || [];
    const updatedReviews = [review, ...reviews];
    const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalScore / updatedReviews.length).toFixed(1));

    await setDoc(
      profileRef,
      {
        reviews: updatedReviews,
        rating: avgRating,
        reviewCount: updatedReviews.length
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ACTIVE_COLLECTION}/${profileId}`);
  }
}

/**
 * Increment WhatsApp clicks count in Firestore
 */
export async function incrementWhatsAppClickCloud(profileId: string): Promise<void> {
  try {
    const profileRef = doc(db, ACTIVE_COLLECTION, profileId);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) return;
    const current = snap.data()?.whatsappClicks || 0;
    await setDoc(profileRef, { whatsappClicks: current + 1 }, { merge: true });
  } catch (error) {
    console.warn('Error incrementing whatsapp clicks in cloud', error);
  }
}

/**
 * Increment views count in Firestore
 */
export async function incrementViewsCountCloud(profileId: string): Promise<void> {
  try {
    const profileRef = doc(db, ACTIVE_COLLECTION, profileId);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) return;
    const current = snap.data()?.viewsCount || 0;
    await setDoc(profileRef, { viewsCount: current + 1 }, { merge: true });
  } catch (error) {
    console.warn('Error incrementing views in cloud', error);
  }
}
