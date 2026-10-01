import React, { useState } from 'react';
import { CategoryId, PricePackage, WorkOutput } from '../types';
import { CATEGORIES, DEFAULT_CITIES } from '../data/initialData';
import { 
  X, Sparkles, Upload, Plus, Trash2, CheckCircle2, 
  AlertCircle, DollarSign, MessageCircle 
} from 'lucide-react';

interface SubmitProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profileData: any) => void;
}

export const SubmitProfileModal: React.FC<SubmitProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('fotografi');
  const [customCategory, setCustomCategory] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [cityOption, setCityOption] = useState('Jakarta Selatan');
  const [customCity, setCustomCity] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [bio, setBio] = useState('');
  const [startingPrice, setStartingPrice] = useState<number>(350000);
  const [priceUnit, setPriceUnit] = useState('sesi');

  // Avatar and work outputs
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [workOutputs, setWorkOutputs] = useState<WorkOutput[]>([
    {
      id: 'wo-new-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
      title: 'Sampel Hasil Kerja 1',
      description: 'Dokumentasi proyek klien terbaru'
    }
  ]);

  // Packages list
  const [packages, setPackages] = useState<PricePackage[]>([
    {
      id: 'pkg-init-1',
      name: 'Paket Standar / Basic',
      price: 350000,
      unit: 'sesi',
      description: 'Layanan standar dengan pengerjaan tepat waktu dan hasil berkualitas tinggi.',
      features: ['Pengerjaan 1-3 hari kerja', 'Konsultasi gratis via WhatsApp', 'Revisi minor 2x'],
      popular: true
    }
  ]);

  // Temporary input for new package
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState<number>(500000);
  const [newPkgUnit, setNewPkgUnit] = useState('proyek');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgFeatures, setNewPkgFeatures] = useState('Hasil resolusi tinggi, Garansi pengerjaan');

  // Add package handler
  const handleAddPackage = () => {
    if (!newPkgName.trim()) return;
    const featList = newPkgFeatures
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    setPackages([
      ...packages,
      {
        id: `pkg-${Date.now()}`,
        name: newPkgName.trim(),
        price: newPkgPrice,
        unit: newPkgUnit.trim() || 'sesi',
        description: newPkgDesc.trim() || 'Layanan profesional dengan standar terbaik.',
        features: featList.length > 0 ? featList : ['Hasil berkualitas', 'Dukungan revisi']
      }
    ]);

    setNewPkgName('');
    setNewPkgPrice(500000);
    setNewPkgDesc('');
    setNewPkgFeatures('Hasil resolusi tinggi, Garansi pengerjaan');
  };

  const handleRemovePackage = (pkgId: string) => {
    setPackages(packages.filter((p) => p.id !== pkgId));
  };

  // Add work output
  const [workImgUrl, setWorkImgUrl] = useState('');
  const handleAddWorkOutput = () => {
    if (!workImgUrl.trim()) return;
    setWorkOutputs([
      ...workOutputs,
      {
        id: `wo-${Date.now()}`,
        type: 'image',
        url: workImgUrl.trim(),
        title: `Karya #${workOutputs.length + 1}`
      }
    ]);
    setWorkImgUrl('');
  };

  // File upload avatar demo handler
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // File upload portfolio demo handler
  const handlePortfolioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setWorkOutputs([
            ...workOutputs,
            {
              id: `wo-upload-${Date.now()}`,
              type: 'image',
              url: reader.result,
              title: file.name.split('.')[0] || 'Hasil Proyek Baru'
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedCategory = category === 'lainnya' ? (customCategory.trim() || 'Lainnya') : category;
    const resolvedCity = cityOption === 'lainnya' ? (customCity.trim() || 'Lainnya') : cityOption;

    const payload = {
      name: name.trim(),
      businessName: businessName.trim() || undefined,
      title: title.trim(),
      category: resolvedCategory,
      avatar,
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
      verified: false,
      featured: false
    };

    onSubmit(payload);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[28px] border-3 border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A] sm:shadow-[12px_12px_0px_#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] px-6 py-4 bg-[#FDFCF8]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5A5F] text-white font-black text-sm border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              TT
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-[#1A1A1A] tracking-tight">
                Daftar Jadi Mitra Titik Temu
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 font-bold">
                Tampilkan keahlian, price list, dan WhatsApp Anda ke seluruh calon klien
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
          {submitted ? (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-black text-[#1A1A1A]">
                Pendaftaran Berhasil Dikirim!
              </h3>
              <p className="text-sm text-[#1A1A1A]/80 font-medium leading-relaxed">
                Profil dan price list usaha Anda telah masuk ke sistem antrean <strong>Titik Temu</strong>. Tim kurator/admin kami akan meninjau kontak sebelum profil Anda tampil publik.
              </p>
              <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FFD166]/20 p-4 text-xs text-[#1A1A1A] font-medium text-left">
                <strong>Tips Admin:</strong> Karena Anda menjalankan sistem ini, Anda dapat langsung menyetujui profil ini lewat tombol <strong>"Admin"</strong> di navbar atas.
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="brutal-btn mt-4 bg-[#6B4EFE] px-7 py-3 text-xs font-black text-white cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
              
              {/* Info Notice */}
              <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FFD166]/20 p-4 flex items-start gap-3 shadow-[3px_3px_0px_#1A1A1A]">
                <AlertCircle className="h-5 w-5 text-[#FF5A5F] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1A1A1A] font-medium leading-relaxed">
                  Isi data dengan lengkap dan jujur. Calon customer akan langsung menghubungi Anda ke <strong>WhatsApp</strong> berdasarkan tarif dan portofolio yang Anda cantumkan di formulir ini.
                </div>
              </div>

              {/* SECTION 1: Identitas & Profesi */}
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-black text-[#1A1A1A] border-b-2 border-[#1A1A1A]/10 pb-2">
                  1. Identitas & Bidang Keahlian
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Nama Lengkap Anda *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Arya Bimasakti"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Nama Brand / Studio / Usaha (Opsional)
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Arya Creative Lab"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
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
                      <div className="mt-2.5 animate-fade-in rounded-xl border-2 border-[#FF5A5F] bg-amber-50/60 p-2.5 shadow-[2px_2px_0px_#1A1A1A]">
                        <label className="block text-[11px] font-black text-[#FF5A5F] mb-1">
                          Tuliskan Kategori Jasa Anda *
                        </label>
                        <input
                          type="text"
                          required
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Contoh: Sablon Kaos, Voice Actor, Pindahan Rumah, dll"
                          className="w-full rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A] border border-[#1A1A1A] outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Headline / Spesialisasi Profesi *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Wedding & Commercial Photographer"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                {/* Avatar selection */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Foto Profil / Logo Brand *
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                    />
                    <label className="brutal-btn flex items-center gap-2 bg-[#FFD166] px-4 py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Foto Baru</span>
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
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Tentang Anda & Pengalaman Kerja *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan keahlian, alat/perlengkapan yang digunakan, pengalaman pengerjaan, dan jaminan kualitas..."
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 2: Kontak & Alamat */}
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-black text-[#1A1A1A] border-b-2 border-[#1A1A1A]/10 pb-2">
                  2. Kontak WhatsApp & Alamat Lokasi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-600" />
                      <input
                        type="text"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full rounded-xl bg-white py-2 pl-9 pr-3 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Instagram (Opsional)
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Kota Domisili *
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
                      <option value="lainnya">Lainnya (Ketik Kota Anda Sendiri...)</option>
                    </select>

                    {cityOption === 'lainnya' && (
                      <div className="mt-2.5 animate-fade-in rounded-xl border-2 border-[#FF5A5F] bg-amber-50/60 p-2.5 shadow-[2px_2px_0px_#1A1A1A]">
                        <label className="block text-[11px] font-black text-[#FF5A5F] mb-1">
                          Tuliskan Kota / Wilayah Anda *
                        </label>
                        <input
                          type="text"
                          required
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          placeholder="Contoh: Solo, Cirebon, Makassar, Palembang, dll"
                          className="w-full rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A] border border-[#1A1A1A] outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Alamat Lengkap Workshop / Kantor / Tempat Praktek *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Contoh: Jl. Senopati No. 25, Selong, Kebayoran Baru, Jakarta Selatan (Sertakan patokan agar mudah dicari)"
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              {/* SECTION 3: Price List & Paket Layanan */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-2">
                  <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                    3. Price List Transparan & Paket Layanan
                  </h3>
                  <span className="text-xs font-bold text-[#1A1A1A]/60">
                    Minimal cantumkan 1 paket harga
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Tarif Mulai Dari (Rupiah) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10000}
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(Number(e.target.value))}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Satuan Tarif *
                    </label>
                    <input
                      type="text"
                      required
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      placeholder="sesi / porsi / kue / jam / proyek"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                {/* List of currently created packages */}
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex items-start justify-between rounded-2xl border-2 border-[#1A1A1A] bg-[#FDFCF8] p-4 text-xs shadow-[3px_3px_0px_#1A1A1A]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-sm text-[#1A1A1A]">{pkg.name}</span>
                          <span className="font-heading font-extrabold text-[#6B4EFE]">
                            Rp {pkg.price.toLocaleString('id-ID')} /{pkg.unit}
                          </span>
                        </div>
                        <p className="text-[#1A1A1A]/70 text-[11px] font-medium">{pkg.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                          {pkg.features.map((f, i) => (
                            <span key={i} className="rounded-md bg-white px-2 py-0.5 border border-[#1A1A1A] font-bold text-[#1A1A1A]">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePackage(pkg.id)}
                          className="text-[#FF5A5F] hover:bg-neutral-100 p-1.5 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subform to add package */}
                <div className="rounded-2xl border-2 border-[#1A1A1A] bg-white p-4 space-y-3 shadow-[3px_3px_0px_#1A1A1A]">
                  <span className="text-xs font-black text-[#6B4EFE] block">
                    + Tambah Opsi Paket Lainnya
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newPkgName}
                      onChange={(e) => setNewPkgName(e.target.value)}
                      placeholder="Nama Paket (e.g. Paket Pro)"
                      className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
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
                      placeholder="Satuan (e.g. hari / porsi)"
                      className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    value={newPkgFeatures}
                    onChange={(e) => setNewPkgFeatures(e.target.value)}
                    placeholder="Fitur / Yang Didapat (pisahkan dengan koma)"
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

              {/* SECTION 4: Portofolio Foto/Video */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-2">
                  <h3 className="font-heading text-sm font-black text-[#1A1A1A]">
                    4. Dokumentasi Foto/Video Hasil Kerja
                  </h3>
                  <span className="text-xs font-bold text-[#1A1A1A]/60">
                    {workOutputs.length} karya terlampir
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {workOutputs.map((item) => (
                    <div key={item.id} className="relative aspect-video rounded-xl overflow-hidden border-2 border-[#1A1A1A] bg-neutral-100 shadow-[2px_2px_0px_#1A1A1A]">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 text-[10px] font-bold text-white truncate">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="brutal-btn flex items-center justify-center gap-1.5 bg-[#FFD166] px-4 py-2 text-xs font-black text-[#1A1A1A] cursor-pointer w-full sm:w-auto">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Unggah Foto Portofolio</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePortfolioFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2 flex-1 w-full">
                    <input
                      type="text"
                      value={workImgUrl}
                      onChange={(e) => setWorkImgUrl(e.target.value)}
                      placeholder="Atau tempel link gambar URL..."
                      className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddWorkOutput}
                      className="brutal-btn bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A]"
                    >
                      Tambah Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
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
                  className="brutal-btn flex items-center gap-2 bg-[#6B4EFE] px-7 py-3 text-xs font-black text-white cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#FFD166]" />
                  <span>Kirim Pendaftaran Profil</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
