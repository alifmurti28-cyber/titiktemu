import React, { useState } from 'react';
import { WorkerProfile, PricePackage, WorkOutput, CategoryId } from '../types';
import { CATEGORIES, DEFAULT_CITIES } from '../data/initialData';
import { formatRupiah } from '../utils/storage';
import { 
  X, Sparkles, Upload, Plus, Trash2, CheckCircle2, 
  AlertCircle, DollarSign, MessageCircle, FileText, 
  Lock, Save, Image as ImageIcon, Camera 
} from 'lucide-react';
import { compressImage, readFileAsDataUrl } from '../utils/fileUtils';

interface EditPartnerProfileModalProps {
  isOpen: boolean;
  profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (updatedProfile: WorkerProfile) => void;
  isAdmin?: boolean;
}

export const EditPartnerProfileModal: React.FC<EditPartnerProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
  isAdmin = false
}) => {
  if (!isOpen || !profile) return null;

  // Form State initialized with current profile data
  const [name, setName] = useState(profile.name);
  const [businessName, setBusinessName] = useState(profile.businessName || '');
  const [title, setTitle] = useState(profile.title);
  const [category, setCategory] = useState<CategoryId>(profile.category);
  const [customCategory, setCustomCategory] = useState('');
  const [avatar, setAvatar] = useState(profile.avatar);
  const [coverImage, setCoverImage] = useState(profile.coverImage || '');
  const [bio, setBio] = useState(profile.bio);
  
  // Location
  const isDefaultCity = DEFAULT_CITIES.includes(profile.city);
  const [cityOption, setCityOption] = useState(isDefaultCity ? profile.city : 'lainnya');
  const [customCity, setCustomCity] = useState(isDefaultCity ? '' : profile.city);
  const [fullAddress, setFullAddress] = useState(profile.fullAddress);
  
  // Contacts
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [instagram, setInstagram] = useState(profile.instagram || '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl || '');

  // Pricing & Packages
  const [startingPrice, setStartingPrice] = useState<number>(profile.startingPrice);
  const [priceUnit, setPriceUnit] = useState(profile.priceUnit);
  const [packages, setPackages] = useState<PricePackage[]>(profile.pricePackages || []);

  // Work Outputs (Images & PDFs)
  const [workOutputs, setWorkOutputs] = useState<WorkOutput[]>(profile.workOutputs || []);

  // Security PIN
  const [editPin, setEditPin] = useState(profile.editPin || '');

  // New package draft state
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState<number>(profile.startingPrice || 100000);
  const [newPkgUnit, setNewPkgUnit] = useState(profile.priceUnit || 'proyek');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgFeatures, setNewPkgFeatures] = useState('');

  // Work output upload link draft
  const [workImgUrl, setWorkImgUrl] = useState('');

  // Feedback state
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add Package Handler
  const handleAddPackage = () => {
    if (!newPkgName.trim()) return;
    const feats = newPkgFeatures
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const newPkg: PricePackage = {
      id: `pkg-edit-${Date.now()}`,
      name: newPkgName.trim(),
      price: newPkgPrice || startingPrice,
      unit: newPkgUnit.trim() || priceUnit,
      description: newPkgDesc.trim() || 'Layanan bergaransi dengan hasil maksimal.',
      features: feats.length > 0 ? feats : ['Layanan profesional', 'Konsultasi gratis']
    };

    setPackages([...packages, newPkg]);
    setNewPkgName('');
    setNewPkgDesc('');
    setNewPkgFeatures('');
  };

  const handleRemovePackage = (pkgId: string) => {
    setPackages(packages.filter((p) => p.id !== pkgId));
  };

  const handleTogglePopular = (pkgId: string) => {
    setPackages(
      packages.map((p) => ({
        ...p,
        popular: p.id === pkgId ? !p.popular : false
      }))
    );
  };

  // Add Link Work Output
  const handleAddWorkOutputLink = () => {
    if (!workImgUrl.trim()) return;
    setWorkOutputs([
      ...workOutputs,
      {
        id: `wo-edit-${Date.now()}`,
        type: 'image',
        url: workImgUrl.trim(),
        title: `Karya #${workOutputs.length + 1}`
      }
    ]);
    setWorkImgUrl('');
  };

  // Avatar file upload
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 500, 0.85);
        setAvatar(compressed);
      } catch (err) {
        console.error('Failed to compress avatar', err);
      }
    }
  };

  // Portfolio file upload (Image & PDF supported)
  const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const sizeKb = Math.round(file.size / 1024);
      const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      try {
        let finalUrl = '';
        if (isPdf) {
          finalUrl = await readFileAsDataUrl(file);
        } else {
          // Compress portfolio image to ~80-120KB for high performance and zero database errors
          finalUrl = await compressImage(file, 1200, 0.82);
        }

        setWorkOutputs((prev) => [
          ...prev,
          {
            id: `wo-upload-${Date.now()}`,
            type: isPdf ? 'pdf' : 'image',
            url: finalUrl,
            title: file.name.replace(/\.[^/.]+$/, '') || (isPdf ? 'Portofolio Dokumen PDF' : 'Hasil Karya Baru'),
            description: isPdf ? `Dokumen Portofolio PDF (${sizeFormatted})` : undefined,
            fileName: file.name,
            fileSize: sizeFormatted
          }
        ]);
      } catch (err) {
        console.error('Failed to process uploaded file', err);
      }
    }
  };

  const handleRemoveWorkOutput = (woId: string) => {
    setWorkOutputs(workOutputs.filter((w) => w.id !== woId));
  };

  // Save changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedCategory = category === 'lainnya' ? (customCategory.trim() || 'Lainnya') : category;
    const resolvedCity = cityOption === 'lainnya' ? (customCity.trim() || 'Lainnya') : cityOption;

    const updatedProfile: WorkerProfile = {
      ...profile,
      name: name.trim(),
      businessName: businessName.trim() || undefined,
      title: title.trim(),
      category: resolvedCategory as CategoryId,
      avatar,
      coverImage: coverImage.trim() || undefined,
      bio: bio.trim(),
      city: resolvedCity,
      fullAddress: fullAddress.trim(),
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      startingPrice,
      priceUnit: priceUnit.trim(),
      pricePackages: packages,
      workOutputs,
      editPin: editPin.trim() || profile.editPin || whatsapp.trim().slice(-4) || '1234'
    };

    onSave(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[28px] border-3 border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A] sm:shadow-[12px_12px_0px_#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] px-6 py-4 bg-[#FFD166]/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B4EFE] text-white font-black text-sm border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              ✏️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg sm:text-xl font-black text-[#1A1A1A] tracking-tight">
                  Edit Profil Mitra: {profile.name}
                </h2>
                {isAdmin && (
                  <span className="rounded-full bg-[#6B4EFE] px-2 py-0.5 text-[10px] font-black text-white">
                    Mode Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#1A1A1A]/70 font-bold">
                Perbarui paket harga, nomor kontak, portofolio foto, dan dokumen PDF Anda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="brutal-btn flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5A5F] text-white border-2 border-[#1A1A1A] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {savedSuccess ? (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] animate-bounce">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-2xl font-black text-[#1A1A1A]">
                Perubahan Berhasil Disimpan!
              </h3>
              <p className="text-sm text-[#1A1A1A]/80 font-medium">
                Profil mitra Anda telah diperbarui secara langsung di direktori Titik Temu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
              
              {/* SECTION 1: Identitas & Keahlian */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-2">
                  <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                    1. Identitas & Layanan Keahlian
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Nama Lengkap Anda *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Nama Brand / Usaha / Studio (Opsional)
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Murti Creative Studio"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Kategori Layanan *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryId)}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none cursor-pointer"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    {category === 'lainnya' && (
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Tuliskan nama kategori jasa Anda..."
                        className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Spesialisasi / Judul Jasa *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Branding Specialist & Web Developer"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                {/* Avatar & Cover Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Foto Profil / Logo
                    </label>
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt="Preview"
                        className="h-12 w-12 rounded-xl object-cover border-2 border-[#1A1A1A] shrink-0"
                      />
                      <label className="brutal-btn inline-flex items-center gap-1.5 bg-[#FFD166] px-3 py-2 text-xs font-black text-[#1A1A1A] cursor-pointer">
                        <Camera className="h-3.5 w-3.5" />
                        <span>Ganti Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Foto Sampul / Banner URL (Opsional)
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                    Bio & Penjelasan Keahlian *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 2: Kontak & Lokasi */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-2">
                  <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                    2. Lokasi & Nomor Kontak
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Kota Operasional *
                    </label>
                    <select
                      value={cityOption}
                      onChange={(e) => setCityOption(e.target.value)}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none cursor-pointer"
                    >
                      {DEFAULT_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="lainnya">Kota Lainnya (Ketik Manual)...</option>
                    </select>

                    {cityOption === 'lainnya' && (
                      <input
                        type="text"
                        required
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="Ketik nama kota operasional Anda..."
                        className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 08123456789 atau 628123456789"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-mono font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                    Alamat Lengkap / Basis Workshop *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Akun Instagram (Opsional)
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username_anda"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Link Website / Portofolio Eksternal (Opsional)
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://behance.net/..."
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Tarif Dasar & Paket Layanan */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-2">
                  <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                    3. Tarif & Paket Layanan
                  </h3>
                  <span className="text-xs font-bold text-[#1A1A1A]/60">
                    {packages.length} paket aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Tarif Mulai Dari (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={5000}
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(Number(e.target.value))}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-mono font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1A1A1A] mb-1">
                      Satuan Tarif *
                    </label>
                    <input
                      type="text"
                      required
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      placeholder="sesi / jam / proyek / hari"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                {/* Existing Packages List */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-[#1A1A1A]">
                    Daftar Paket Harga yang Tersedia:
                  </label>

                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="relative rounded-2xl border-2 border-[#1A1A1A] bg-white p-3.5 shadow-[2px_2px_0px_#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-sm text-[#1A1A1A]">
                            {pkg.name}
                          </span>
                          <span className="font-mono text-xs font-black text-[#6B4EFE]">
                            {formatRupiah(pkg.price)} /{pkg.unit}
                          </span>
                          {pkg.popular && (
                            <span className="rounded-full bg-[#FFD166] px-2 py-0.2 text-[10px] font-black text-[#1A1A1A] border border-[#1A1A1A]">
                              Paling Populer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1A1A1A]/70 line-clamp-1">{pkg.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pkg.features.map((f, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-[#1A1A1A]/80 border border-[#1A1A1A]/10"
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePopular(pkg.id)}
                          className={`brutal-btn px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                            pkg.popular ? 'bg-[#FFD166] text-[#1A1A1A]' : 'bg-white text-[#1A1A1A]/70'
                          }`}
                        >
                          {pkg.popular ? '★ Populer' : 'Set Populer'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemovePackage(pkg.id)}
                          className="brutal-btn p-1.5 bg-white text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white transition-colors cursor-pointer"
                          title="Hapus paket ini"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Package Box */}
                <div className="rounded-2xl border-2 border-dashed border-[#1A1A1A]/40 bg-[#FDFCF8] p-4 space-y-3">
                  <span className="text-xs font-black text-[#1A1A1A] flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5 text-[#6B4EFE]" />
                    <span>Tambahkan Paket Layanan Baru</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newPkgName}
                      onChange={(e) => setNewPkgName(e.target.value)}
                      placeholder="Nama Paket (e.g. Paket Premium)"
                      className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                    <input
                      type="number"
                      value={newPkgPrice}
                      onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                      placeholder="Harga (Rp)"
                      className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                    />
                    <input
                      type="text"
                      value={newPkgUnit}
                      onChange={(e) => setNewPkgUnit(e.target.value)}
                      placeholder="Satuan (e.g. proyek / hari)"
                      className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    value={newPkgDesc}
                    onChange={(e) => setNewPkgDesc(e.target.value)}
                    placeholder="Deskripsi singkat paket..."
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />

                  <input
                    type="text"
                    value={newPkgFeatures}
                    onChange={(e) => setNewPkgFeatures(e.target.value)}
                    placeholder="Fitur yang didapat (pisahkan dengan koma)"
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleAddPackage}
                    className="brutal-btn inline-flex items-center gap-1.5 bg-[#FFD166] px-4 py-2 text-xs font-black text-[#1A1A1A] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambahkan ke Daftar Paket</span>
                  </button>
                </div>
              </div>

              {/* SECTION 4: Portofolio & Dokumen PDF */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-2 gap-1">
                  <div>
                    <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                      4. Dokumentasi Portofolio & Berkas PDF
                    </h3>
                    <p className="text-[11px] font-bold text-[#6B4EFE]">
                      Bisa melalui PDF untuk portofolio atau foto dokumentasi hasil kerja Anda
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]/60">
                    {workOutputs.length} berkas terlampir
                  </span>
                </div>

                {/* List of current work outputs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {workOutputs.map((item) => {
                    const isPdf = item.type === 'pdf' || item.url.startsWith('data:application/pdf') || item.fileName?.toLowerCase().endsWith('.pdf');
                    return (
                      <div 
                        key={item.id} 
                        className="relative rounded-xl overflow-hidden border-2 border-[#1A1A1A] bg-white shadow-[2px_2px_0px_#1A1A1A] group flex flex-col justify-between"
                      >
                        {isPdf ? (
                          <div className="p-3 bg-rose-50/80 flex flex-col items-center justify-center text-center aspect-[16/10] relative">
                            <span className="absolute top-1.5 left-1.5 rounded bg-[#FF5A5F] px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                              PDF
                            </span>
                            <FileText className="h-8 w-8 text-[#FF5A5F] mb-1" />
                            <span className="text-[11px] font-bold text-[#1A1A1A] line-clamp-1 px-1">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-[#1A1A1A]/60 font-mono mt-0.5">
                              {item.fileSize || 'Dokumen PDF'}
                            </span>
                          </div>
                        ) : (
                          <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                            <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 text-[10px] font-bold text-white truncate">
                              {item.title}
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveWorkOutput(item.id)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-white/95 p-1 text-[#FF5A5F] border border-[#1A1A1A] hover:bg-[#FF5A5F] hover:text-white transition-colors cursor-pointer"
                          title="Hapus berkas ini"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Upload action and link input */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="brutal-btn flex items-center justify-center gap-1.5 bg-[#FFD166] px-4 py-2.5 text-xs font-black text-[#1A1A1A] cursor-pointer w-full sm:w-auto">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Unggah Berkas Baru (Foto / PDF)</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      onChange={handlePortfolioFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2 flex-1 w-full">
                    <input
                      type="text"
                      value={workImgUrl}
                      onChange={(e) => setWorkImgUrl(e.target.value)}
                      placeholder="Atau tempel link gambar / PDF URL..."
                      className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddWorkOutputLink}
                      className="brutal-btn bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer"
                    >
                      Tambah Link
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Kunci PIN Keamanan Profil */}
              <div className="p-4 rounded-2xl border-2 border-[#1A1A1A] bg-[#6B4EFE]/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#6B4EFE]" />
                  <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                    5. PIN Keamanan Edit Profil
                  </h3>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 font-medium">
                  PIN ini melindungi profil Anda agar tidak bisa diubah oleh mitra lain. Anda dapat memperbarui PIN 4-6 digit di sini.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 1234"
                  className="w-full sm:w-48 rounded-xl bg-white px-3 py-2 text-xs font-mono font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none tracking-widest"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-[#1A1A1A]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="brutal-btn bg-white px-5 py-2.5 text-xs font-bold text-[#1A1A1A] cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="brutal-btn flex items-center gap-2 bg-[#6B4EFE] px-7 py-2.5 text-xs font-black text-white cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
