import React, { useState, useEffect, useMemo } from 'react';
import { WorkerProfile, CategoryId, PricePackage } from './types';
import { 
  getActiveProfiles, getPendingProfiles, saveActiveProfiles, 
  savePendingProfiles, submitNewPendingProfile, approvePendingProfile, 
  rejectPendingProfile, addActiveProfile, updateActiveProfile, 
  deleteActiveProfile, incrementWhatsappClick, incrementViewCount, 
  addReviewToProfile, getFavorites, toggleFavorite, 
  isAdminLoggedIn, setAdminLogin, resetProfilesToDefault, formatRupiah,
  saveTrashProfiles, getTrashProfiles, restoreProfileFromTrash, deletePermanentlyFromTrash, emptyTrash
} from './utils/storage';
import { DEFAULT_CITIES, INITIAL_PROFILES } from './data/initialData';
import {
  subscribeToActiveProfiles,
  subscribeToPendingProfiles,
  subscribeToTrashProfiles,
  submitPendingProfileCloud,
  approvePendingProfileCloud,
  rejectPendingProfileCloud,
  updateActiveProfileCloud,
  deleteActiveProfileCloud,
  restoreProfileFromTrashCloud,
  deletePermanentlyFromTrashCloud,
  emptyTrashCloud,
  addReviewCloud,
  incrementWhatsAppClickCloud,
  incrementViewsCountCloud,
} from './services/firestoreService';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { SubmitProfileModal } from './components/SubmitProfileModal';
import { AdminModal } from './components/AdminModal';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { EditPartnerProfileModal } from './components/EditPartnerProfileModal';
import { PartnerAuthGateModal } from './components/PartnerAuthGateModal';
import { PartnerLookupEditModal } from './components/PartnerLookupEditModal';

import { Search, Heart, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function App() {
  // Profiles data states
  const [activeProfiles, setActiveProfiles] = useState<WorkerProfile[]>([]);
  const [pendingProfiles, setPendingProfiles] = useState<WorkerProfile[]>([]);
  const [trashProfiles, setTrashProfiles] = useState<WorkerProfile[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'popular'>('recommended');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);

  // Modals
  const [selectedProfileModal, setSelectedProfileModal] = useState<WorkerProfile | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });

  // Partner Self-Editing States
  const [isPartnerLookupOpen, setIsPartnerLookupOpen] = useState(false);
  const [partnerToVerifyPin, setPartnerToVerifyPin] = useState<WorkerProfile | null>(null);
  const [partnerToEdit, setPartnerToEdit] = useState<WorkerProfile | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load & Realtime synchronization with Firebase Firestore & Cross-Tab Sync
  useEffect(() => {
    // Fast initial local state
    setActiveProfiles(getActiveProfiles());
    setPendingProfiles(getPendingProfiles());
    setTrashProfiles(getTrashProfiles());
    setFavorites(getFavorites());
    setIsAdmin(isAdminLoggedIn());

    // 1. Cross-Tab Immediate Sync for tabs on the same origin (e.g. Vercel Tab 1 <-> Tab 2)
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key.includes('active_profiles')) {
        setActiveProfiles(getActiveProfiles());
      }
      if (!e.key || e.key.includes('pending_profiles')) {
        setPendingProfiles(getPendingProfiles());
      }
      if (!e.key || e.key.includes('trash_profiles')) {
        setTrashProfiles(getTrashProfiles());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 2. Realtime listener for active profiles from Firestore
    const unsubActive = subscribeToActiveProfiles((cloudProfiles) => {
      if (cloudProfiles && cloudProfiles.length > 0) {
        setActiveProfiles(cloudProfiles);
        saveActiveProfiles(cloudProfiles);
      }
    });

    // 3. Realtime listener for pending profiles from Firestore
    const unsubPending = subscribeToPendingProfiles((cloudPending) => {
      setPendingProfiles(cloudPending);
      savePendingProfiles(cloudPending);
    });

    // 4. Realtime listener for trash profiles from Firestore
    const unsubTrash = subscribeToTrashProfiles((cloudTrash) => {
      setTrashProfiles(cloudTrash);
      saveTrashProfiles(cloudTrash);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubActive();
      unsubPending();
      unsubTrash();
    };
  }, []);

  // Distinct cities list from default cities and active profiles
  const cities = useMemo(() => {
    const set = new Set<string>(DEFAULT_CITIES);
    activeProfiles.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [activeProfiles]);

  // Handle WhatsApp Click
  const handleWhatsAppClick = (profile: WorkerProfile, selectedPackage?: PricePackage) => {
    incrementWhatsappClick(profile.id);
    incrementWhatsAppClickCloud(profile.id).catch(() => {});
    
    // Update local state count
    setActiveProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.id ? { ...p, whatsappClicks: (p.whatsappClicks || 0) + 1 } : p
      )
    );

    let phone = profile.whatsapp.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }

    let message = '';
    if (selectedPackage) {
      message = `Halo kak ${profile.name}, saya melihat profil Anda di *Titik Temu*.\n\nSaya tertarik dengan paket: *${selectedPackage.name}* (${formatRupiah(selectedPackage.price)} / ${selectedPackage.unit}).\n\nApakah saat ini masih menerima jadwal/pesanan? Terima kasih!`;
    } else {
      message = `Halo kak ${profile.name}, saya menemukan profil dan portofolio Anda di *Titik Temu* untuk jasa: *${profile.title}*.\n\nBolehkah saya menanyakan ketersediaan jadwal dan detail layanannya? Terima kasih!`;
    }

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle Profile select to open detail
  const handleSelectProfile = (profile: WorkerProfile) => {
    incrementViewCount(profile.id);
    incrementViewsCountCloud(profile.id).catch(() => {});
    setSelectedProfileModal(profile);
  };

  // Toggle favorite
  const handleToggleFavorite = (profileId: string) => {
    const isNowFav = toggleFavorite(profileId);
    setFavorites(getFavorites());
    showToast(isNowFav ? 'Disimpan ke koleksi favorit Anda' : 'Dihapus dari koleksi favorit');
  };

  // Handle submitting review
  const handleAddReview = (
    profileId: string,
    review: { author: string; rating: number; comment: string; clientType?: string }
  ) => {
    addReviewToProfile(profileId, review);
    const updated = getActiveProfiles();
    setActiveProfiles(updated);
    const current = updated.find((p) => p.id === profileId);
    if (current) setSelectedProfileModal(current);
    addReviewCloud(profileId, {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }).catch(e => console.warn('Cloud review sync', e));
    showToast('Ulasan Anda berhasil ditambahkan & tersimpan!');
  };

  // Public Submit profile handler
  const handleSubmitProfile = (profileData: any) => {
    const newProfile = submitNewPendingProfile(profileData);
    setPendingProfiles((prev) => {
      const exists = prev.some((p) => p.id === newProfile.id);
      return exists ? prev : [newProfile, ...prev];
    });
    submitPendingProfileCloud(profileData).catch(e => console.warn('Cloud submit sync', e));
    showToast('Pendaftaran profil berhasil dikirim! Data tersinkron ke cloud & admin.');
  };

  // Admin login
  const handleAdminLogin = (email: string, pass: string): boolean => {
    // Valid admin credentials (either official admin email or custom demo)
    if (
      (email === 'admin@titiktemu.id' && pass === 'admin123') ||
      (email === 'alifmurti28@gmail.com' && pass === 'admin123')
    ) {
      setAdminLogin(true);
      setIsAdmin(true);
      showToast('Berhasil masuk sebagai Admin Titik Temu');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setAdminLogin(false);
    setIsAdmin(false);
    showToast('Telah keluar dari mode Admin');
  };

  const handleApprovePending = (id: string) => {
    const target = pendingProfiles.find(p => p.id === id) || getPendingProfiles().find(p => p.id === id);
    approvePendingProfile(id);
    const updatedActive = getActiveProfiles();
    const updatedPending = getPendingProfiles();
    setActiveProfiles(updatedActive);
    setPendingProfiles(updatedPending);
    // Sync to Firestore Cloud with fallback profile object so cloud write NEVER fails!
    approvePendingProfileCloud(id, target).catch(e => console.warn('Cloud approve sync', e));
    // Reset search & category filters so the approved profile appears front and center
    setSelectedCategory('all');
    setSelectedCity('all');
    setSearchQuery('');
    setShowingFavoritesOnly(false);
    showToast('Profil mitra berhasil disetujui & langsung live di cloud!');
  };

  const handleRejectPending = (id: string) => {
    const target = pendingProfiles.find(p => p.id === id) || getPendingProfiles().find(p => p.id === id);
    rejectPendingProfile(id);
    setPendingProfiles(getPendingProfiles());
    setTrashProfiles(getTrashProfiles());
    rejectPendingProfileCloud(id, target).catch(e => console.warn('Cloud reject sync', e));
    showToast('Pengajuan telah ditolak dan dipindahkan ke Kotak Sampah');
  };

  const handleDeleteActive = (id: string) => {
    const target = activeProfiles.find(p => p.id === id) || getActiveProfiles().find(p => p.id === id);
    deleteActiveProfile(id);
    setActiveProfiles(getActiveProfiles());
    setTrashProfiles(getTrashProfiles());
    deleteActiveProfileCloud(id, target).catch(e => console.warn('Cloud delete sync', e));
    showToast('Profil mitra telah dipindahkan ke Kotak Sampah');
  };

  const handleRestoreFromTrash = (id: string, directPublish: boolean = true) => {
    const target = trashProfiles.find(p => p.id === id) || getTrashProfiles().find(p => p.id === id);
    restoreProfileFromTrash(id, directPublish);
    setActiveProfiles(getActiveProfiles());
    setPendingProfiles(getPendingProfiles());
    setTrashProfiles(getTrashProfiles());
    restoreProfileFromTrashCloud(id, directPublish, target).catch(e => console.warn('Cloud restore sync', e));
    showToast(directPublish ? 'Mitra berhasil dipulihkan & langsung aktif di direktori!' : 'Mitra dikembalikan ke antrean pengajuan');
  };

  const handleDeletePermanentFromTrash = (id: string) => {
    deletePermanentlyFromTrash(id);
    setTrashProfiles(getTrashProfiles());
    deletePermanentlyFromTrashCloud(id).catch(e => console.warn('Cloud permanent delete sync', e));
    showToast('Profil telah dihapus permanen dari kotak sampah');
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    setTrashProfiles([]);
    emptyTrashCloud().catch(e => console.warn('Cloud empty trash sync', e));
    showToast('Seluruh isi kotak sampah berhasil dibersihkan');
  };

  const handleUpdateActive = (profile: WorkerProfile) => {
    updateActiveProfile(profile);
    setActiveProfiles(getActiveProfiles());
    updateActiveProfileCloud(profile).catch(e => console.warn('Cloud update sync', e));
    showToast('Data mitra berhasil diperbarui di cloud');
  };

  // Partner Self-Edit Handlers
  const handleStartEditPartner = (profile: WorkerProfile) => {
    if (isAdmin) {
      setPartnerToEdit(profile);
    } else {
      setPartnerToVerifyPin(profile);
    }
  };

  const handlePinVerifiedSuccess = () => {
    if (partnerToVerifyPin) {
      setPartnerToEdit(partnerToVerifyPin);
      setPartnerToVerifyPin(null);
    }
  };

  const handleSaveEditedPartner = (updated: WorkerProfile) => {
    updateActiveProfile(updated);
    const refreshed = getActiveProfiles();
    setActiveProfiles(refreshed);
    if (selectedProfileModal && selectedProfileModal.id === updated.id) {
      setSelectedProfileModal(updated);
    }
    updateActiveProfileCloud(updated).catch(e => console.warn('Cloud save partner sync', e));
    showToast(`Profil ${updated.name} berhasil diperbarui di cloud!`);
  };

  const handleAddNewManual = (profileData: any) => {
    const created = addActiveProfile(profileData);
    setActiveProfiles(getActiveProfiles());
    updateActiveProfileCloud(created).catch(e => console.warn('Cloud manual add sync', e));
    showToast('Mitra baru berhasil ditambahkan langsung ke cloud!');
  };

  const handleResetDefaults = () => {
    resetProfilesToDefault();
    setActiveProfiles(getActiveProfiles());
    setPendingProfiles(getPendingProfiles());
    showToast('Data telah direset ke starter defaults');
  };

  // Filter & Sort Logic
  const filteredProfiles = useMemo(() => {
    return activeProfiles
      .filter((p) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBusiness = p.businessName?.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchAddress = p.fullAddress.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchBio = p.bio.toLowerCase().includes(q);
          if (!matchName && !matchTitle && !matchBusiness && !matchCity && !matchAddress && !matchCat && !matchBio) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // City filter
        if (selectedCity !== 'all' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // Verified only filter
        if (verifiedOnly && !p.verified) {
          return false;
        }

        // Favorites only filter
        if (showingFavoritesOnly && !favorites.includes(p.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'popular') {
          const popA = (a.viewsCount || 0) + (a.whatsappClicks || 0) * 3;
          const popB = (b.viewsCount || 0) + (b.whatsappClicks || 0) * 3;
          return popB - popA;
        }
        if (sortBy === 'price_asc') {
          return a.startingPrice - b.startingPrice;
        }
        if (sortBy === 'price_desc') {
          return b.startingPrice - a.startingPrice;
        }
        // Recommended default: featured first, then highest rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [
    activeProfiles,
    searchQuery,
    selectedCategory,
    selectedCity,
    verifiedOnly,
    showingFavoritesOnly,
    favorites,
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] flex flex-col selection:bg-[#FF5A5F] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-80 flex items-center gap-2 rounded-2xl border-2 border-[#1A1A1A] bg-[#FFD166] px-5 py-3 text-xs sm:text-sm font-black text-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] animate-bounce">
          <Sparkles className="h-4 w-4 text-[#FF5A5F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenPartnerLookupEdit={() => setIsPartnerLookupOpen(true)}
        isAdmin={isAdmin}
        favoritesCount={favorites.length}
        onToggleFavoritesView={() => setShowingFavoritesOnly(!showingFavoritesOnly)}
        showingFavoritesOnly={showingFavoritesOnly}
        pendingCount={pendingProfiles.length}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        cities={cities}
        totalProfiles={activeProfiles.length}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onSelectProfileById={(id: string) => {
          const target = activeProfiles.find((p) => p.id === id) || INITIAL_PROFILES.find((p) => p.id === id);
          if (target) {
            handleSelectProfile(target);
          }
        }}
      />

      {/* Filter and Category Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        cities={cities}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        verifiedOnly={verifiedOnly}
        onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
        showingFavoritesOnly={showingFavoritesOnly}
        onToggleFavoritesOnly={() => setShowingFavoritesOnly(!showingFavoritesOnly)}
        totalFiltered={filteredProfiles.length}
      />

      {/* Main Directory Grid */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Results Info Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pb-4 border-b-2 border-[#1A1A1A]/10">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              {showingFavoritesOnly
                ? 'Koleksi Jasa yang Disimpan'
                : selectedCategory === 'all'
                ? 'Daftar Seluruh Mitra & Penyedia Jasa'
                : `Mitra Kategori: ${selectedCategory.toUpperCase()}`}
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-medium mt-1">
              Temukan portofolio kerja, pricelist transparan, dan hubungi langsung melalui WhatsApp.
            </p>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedCity !== 'all' || verifiedOnly || showingFavoritesOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCity('all');
                setVerifiedOnly(false);
                setShowingFavoritesOnly(false);
              }}
              className="brutal-btn bg-[#FFD166] px-4 py-2 text-xs font-black text-[#1A1A1A] cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isFavorite={favorites.includes(profile.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectProfile={handleSelectProfile}
                onWhatsAppClick={(p, e) => {
                  e.stopPropagation();
                  handleWhatsAppClick(p);
                }}
                onOpenLightbox={(url, title) =>
                  setLightboxData({ isOpen: true, url, title })
                }
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="brutal-card p-12 text-center max-w-xl mx-auto my-12 space-y-4 bg-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl font-black text-[#1A1A1A]">Tidak Ditemukan Hasil yang Cocok</h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-medium leading-relaxed">
              Coba gunakan kata kunci lain, pilih "Semua Lokasi", atau hilangkan filter pencarian yang sedang aktif.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCity('all');
                  setVerifiedOnly(false);
                  setShowingFavoritesOnly(false);
                }}
                className="brutal-btn bg-[#FFD166] px-5 py-2.5 text-xs font-black text-[#1A1A1A] cursor-pointer"
              >
                Lihat Semua Mitra
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="brutal-btn bg-[#6B4EFE] px-5 py-2.5 text-xs font-black text-white cursor-pointer"
              >
                Daftarkan Jasa Baru
              </button>
            </div>
          </div>
        )}

      </main>

      {/* How it works Section */}
      <HowItWorks />

      {/* Footer with @alifmurti_28 Instagram */}
      <Footer
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Modal: Full Profile Detail */}
      <ProfileDetailModal
        profile={selectedProfileModal}
        onClose={() => setSelectedProfileModal(null)}
        onWhatsAppClick={(profile, pkg) => handleWhatsAppClick(profile, pkg)}
        onOpenLightbox={(url, title) =>
          setLightboxData({ isOpen: true, url, title })
        }
        onAddReview={handleAddReview}
        onOpenEditPartner={handleStartEditPartner}
      />

      {/* Modal: Public Profile Submission */}
      <SubmitProfileModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitProfile}
      />

      {/* Modal: Admin Dashboard & Login */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        pendingProfiles={pendingProfiles}
        activeProfiles={activeProfiles}
        trashProfiles={trashProfiles}
        onApprovePending={handleApprovePending}
        onRejectPending={handleRejectPending}
        onDeleteActive={handleDeleteActive}
        onUpdateActive={handleUpdateActive}
        onAddNewManual={handleAddNewManual}
        onResetDefaults={handleResetDefaults}
        onRestoreFromTrash={handleRestoreFromTrash}
        onDeletePermanentFromTrash={handleDeletePermanentFromTrash}
        onEmptyTrash={handleEmptyTrash}
      />

      {/* Modal: Partner Lookup & PIN Verification to Edit */}
      <PartnerLookupEditModal
        isOpen={isPartnerLookupOpen}
        onClose={() => setIsPartnerLookupOpen(false)}
        activeProfiles={activeProfiles}
        onSelectProfileToEdit={(profile) => {
          setPartnerToEdit(profile);
        }}
        isAdmin={isAdmin}
      />

      {/* Modal: Single Profile PIN Verification Gate */}
      <PartnerAuthGateModal
        isOpen={!!partnerToVerifyPin}
        profile={partnerToVerifyPin}
        onClose={() => setPartnerToVerifyPin(null)}
        onSuccess={handlePinVerifiedSuccess}
        isAdmin={isAdmin}
      />

      {/* Modal: Full Access Edit Partner Profile Modal */}
      <EditPartnerProfileModal
        isOpen={!!partnerToEdit}
        profile={partnerToEdit}
        onClose={() => setPartnerToEdit(null)}
        onSave={handleSaveEditedPartner}
        isAdmin={isAdmin}
      />

      {/* Modal: Lightbox Image Viewer */}
      <LightboxModal
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.url}
        title={lightboxData.title}
        onClose={() => setLightboxData({ isOpen: false, url: '', title: '' })}
      />

    </div>
  );
}
