import React, { useState } from 'react';
import { WorkerProfile, CategoryId } from '../types';
import { CATEGORIES } from '../data/initialData';
import { formatRupiah } from '../utils/storage';
import { 
  X, Lock, ShieldCheck, CheckCircle2, XCircle, 
  Trash2, Edit3, Plus, Download, Upload, RefreshCw, 
  LogOut, Eye, MessageCircle, AlertTriangle, Check, FileText, RotateCcw, Undo2 
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
  pendingProfiles: WorkerProfile[];
  activeProfiles: WorkerProfile[];
  trashProfiles?: WorkerProfile[];
  onApprovePending: (id: string) => void;
  onRejectPending: (id: string) => void;
  onDeleteActive: (id: string) => void;
  onUpdateActive: (profile: WorkerProfile) => void;
  onAddNewManual: (profileData: any) => void;
  onResetDefaults: () => void;
  onRestoreFromTrash?: (id: string, directPublish?: boolean) => void;
  onDeletePermanentFromTrash?: (id: string) => void;
  onEmptyTrash?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  pendingProfiles,
  activeProfiles,
  trashProfiles = [],
  onApprovePending,
  onRejectPending,
  onDeleteActive,
  onUpdateActive,
  onAddNewManual,
  onResetDefaults,
  onRestoreFromTrash,
  onDeletePermanentFromTrash,
  onEmptyTrash
}) => {
  if (!isOpen) return null;

  // Login form state
  const [email, setEmail] = useState('alifmurti28@gmail.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'stats' | 'trash'>('pending');
  const [searchFilter, setSearchFilter] = useState('');

  // Editing state
  const [editingProfile, setEditingProfile] = useState<WorkerProfile | null>(null);

  // Manual Add state
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState<CategoryId>('fotografi');
  const [manualCity, setManualCity] = useState('Jakarta Selatan');
  const [manualAddress, setManualAddress] = useState('');
  const [manualWhatsapp, setManualWhatsapp] = useState('');
  const [manualStartingPrice, setManualStartingPrice] = useState<number>(350000);
  const [manualPriceUnit, setManualPriceUnit] = useState('sesi');
  const [manualBio, setManualBio] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = onLogin(email.trim(), password);
    if (!success) {
      setLoginError('Email atau kata sandi salah. Gunakan alifmurti28@gmail.com dan admin123');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('alifmurti28@gmail.com');
    setPassword('admin123');
    setLoginError('');
  };

  const handleQuickLogin = () => {
    setEmail('alifmurti28@gmail.com');
    setPassword('admin123');
    setLoginError('');
    onLogin('alifmurti28@gmail.com', 'admin123');
  };

  // Filtered active profiles
  const filteredActive = activeProfiles.filter((p) => {
    const q = searchFilter.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalWhatsappClicks = activeProfiles.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0);
  const totalViews = activeProfiles.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

  // Handle save edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    onUpdateActive(editingProfile);
    setEditingProfile(null);
  };

  // Handle create manual
  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = {
      name: manualName.trim(),
      title: manualTitle.trim(),
      category: manualCategory,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: manualBio.trim() || 'Penyedia jasa berpengalaman dengan hasil pengerjaan rapi dan bergaransi.',
      city: manualCity.trim(),
      fullAddress: manualAddress.trim(),
      whatsapp: manualWhatsapp.trim(),
      startingPrice: manualStartingPrice,
      priceUnit: manualPriceUnit.trim() || 'sesi',
      pricePackages: [
        {
          id: `pkg-${Date.now()}`,
          name: 'Paket Standar',
          price: manualStartingPrice,
          unit: manualPriceUnit.trim() || 'sesi',
          description: 'Layanan standar siap dikerjakan dengan hasil maksimal.',
          features: ['Hasil kerja bergaransi', 'Konsultasi gratis via WhatsApp']
        }
      ],
      workOutputs: [],
      verified: true,
      featured: false
    };

    onAddNewManual(newProfile);
    setIsAddingManual(false);
    // Reset form
    setManualName('');
    setManualTitle('');
    setManualAddress('');
    setManualWhatsapp('');
    setManualBio('');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeProfiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `titik_temu_data_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative flex flex-col w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[28px] border-3 border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A] sm:shadow-[12px_12px_0px_#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] px-6 py-4 bg-[#FDFCF8]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
                <span>Dashboard Pengelola Titik Temu</span>
                {isAdmin && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-600 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                    Online
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 font-bold">
                Pusat moderasi pendaftaran mitra, kurasi direktori, dan kontrol data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={onLogout}
                className="brutal-btn flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 text-xs font-bold hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5A5F] text-white border-2 border-[#1A1A1A] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Not Logged In: Login Form */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD166] border-2 border-[#1A1A1A] text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-2xl font-black text-[#1A1A1A]">Login Admin Titik Temu</h3>
              <p className="text-xs text-[#1A1A1A]/70 font-bold">
                Akses khusus pengelola untuk menyetujui formulir mitra dan mengelola direktori.
              </p>
            </div>

            {loginError && (
              <div className="rounded-xl border-2 border-rose-600 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#1A1A1A] mb-1">
                  Email Admin
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white px-3 py-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                  placeholder="admin@titiktemu.id"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-white px-3 py-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="brutal-btn w-full bg-[#6B4EFE] py-3 font-extrabold text-white cursor-pointer"
              >
                Masuk ke Dashboard
              </button>
            </form>

            {/* Quick 1-Click Login Button */}
            <div className="pt-4 border-t-2 border-[#1A1A1A]/10 space-y-2">
              <button
                type="button"
                onClick={handleQuickLogin}
                className="brutal-btn w-full flex items-center justify-center gap-2 bg-[#FFD166] py-3 text-xs font-black text-[#1A1A1A] cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Masuk Instan Sebagai Admin (1-Klik)</span>
              </button>
              <p className="text-[11px] text-center text-[#1A1A1A]/60 font-medium">
                Akun owner default: alifmurti28@gmail.com (Password: admin123)
              </p>
            </div>
          </div>
        ) : (
          /* Logged In: Full Admin Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden bg-white">
            
            {/* Dashboard Tabs Bar */}
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] bg-[#FDFCF8] px-6">
              <div className="flex items-center gap-6 overflow-x-auto py-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className={`flex items-center gap-2 pb-1 text-xs sm:text-sm font-extrabold border-b-3 transition-all cursor-pointer ${
                    activeTab === 'pending'
                      ? 'border-[#6B4EFE] text-[#6B4EFE]'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>Antrean Pengajuan Baru</span>
                  <span className={`rounded-full px-2 py-0.2 text-[10px] font-black border border-[#1A1A1A] ${
                    pendingProfiles.length > 0 ? 'bg-[#FF5A5F] text-white' : 'bg-neutral-200 text-[#1A1A1A]'
                  }`}>
                    {pendingProfiles.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('active')}
                  className={`flex items-center gap-2 pb-1 text-xs sm:text-sm font-extrabold border-b-3 transition-all cursor-pointer ${
                    activeTab === 'active'
                      ? 'border-[#6B4EFE] text-[#6B4EFE]'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>Kelola Mitra Aktif</span>
                  <span className="rounded-full bg-neutral-200 px-2 py-0.2 text-[10px] font-mono text-[#1A1A1A] border border-[#1A1A1A]">
                    {activeProfiles.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('stats')}
                  className={`pb-1 text-xs sm:text-sm font-extrabold border-b-3 transition-all cursor-pointer ${
                    activeTab === 'stats'
                      ? 'border-[#6B4EFE] text-[#6B4EFE]'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  Statistik & Pengaturan
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('trash')}
                  className={`flex items-center gap-1.5 pb-1 text-xs sm:text-sm font-extrabold border-b-3 transition-all cursor-pointer ${
                    activeTab === 'trash'
                      ? 'border-[#FF5A5F] text-[#FF5A5F]'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Kotak Sampah & Ditolak</span>
                  {trashProfiles.length > 0 && (
                    <span className="rounded-full bg-[#FF5A5F] px-2 py-0.2 text-[10px] font-black text-white border border-[#1A1A1A]">
                      {trashProfiles.length}
                    </span>
                  )}
                </button>
              </div>

              {activeTab === 'active' && (
                <button
                  type="button"
                  onClick={() => setIsAddingManual(true)}
                  className="brutal-btn hidden sm:flex items-center gap-1.5 bg-[#FFD166] px-3 py-1.5 text-xs font-black text-[#1A1A1A] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Mitra Manual</span>
                </button>
              )}

              {activeTab === 'trash' && trashProfiles.length > 0 && onEmptyTrash && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh kotak sampah secara permanen?')) {
                      onEmptyTrash();
                    }
                  }}
                  className="brutal-btn hidden sm:flex items-center gap-1.5 bg-rose-50 text-[#FF5A5F] border-2 border-[#FF5A5F] px-3 py-1.5 text-xs font-black cursor-pointer hover:bg-[#FF5A5F] hover:text-white transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Kosongkan Sampah</span>
                </button>
              )}
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FDFCF8]">
              
              {/* TAB 1: PENDING PROFILES */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-base font-black text-[#1A1A1A]">
                        Pengajuan Profil Dari Formulir Publik
                      </h3>
                      <p className="text-xs text-[#1A1A1A]/70 font-medium">
                        Profil ini belum muncul di halaman publik sampai Anda menyetujuinya.
                      </p>
                    </div>
                  </div>

                  {pendingProfiles.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[#1A1A1A]/30 p-12 text-center text-[#1A1A1A]/60 bg-white">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                      <p className="font-bold text-[#1A1A1A]">Tidak ada pengajuan yang tertunda</p>
                      <p className="text-xs mt-1">Semua pendaftaran mitra telah diproses atau disetujui.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingProfiles.map((p) => (
                        <div
                          key={p.id}
                          className="brutal-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
                        >
                          <div className="flex items-start gap-3.5">
                            <img
                              src={p.avatar}
                              alt={p.name}
                              className="h-12 w-12 rounded-xl object-cover border-2 border-[#1A1A1A] shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-heading font-black text-sm text-[#1A1A1A]">{p.name}</h4>
                                <span className="rounded-md bg-[#FFD166] px-2 py-0.5 text-[10px] uppercase font-black text-[#1A1A1A] border border-[#1A1A1A]">
                                  {p.category}
                                </span>
                              </div>
                              <p className="text-xs text-[#1A1A1A]/80 font-medium">{p.title}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#1A1A1A]/60 font-bold">
                                <span>Kota: {p.city}</span>
                                <span>·</span>
                                <span>WA: {p.whatsapp}</span>
                                <span>·</span>
                                <span className="font-heading font-black text-[#1A1A1A]">
                                  Mulai {formatRupiah(p.startingPrice)} /{p.priceUnit}
                                </span>
                              </div>

                              {/* Portofolio & PDF Attachments Indicator */}
                              {p.workOutputs && p.workOutputs.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1A1A1A]/10 mt-1">
                                  {p.workOutputs.some(w => w.type === 'pdf' || w.url?.startsWith('data:application/pdf') || w.fileName?.endsWith('.pdf')) && (
                                    <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 border border-[#FF5A5F]/40 px-2 py-0.5 text-[11px] font-bold text-[#FF5A5F]">
                                      <FileText className="h-3.5 w-3.5" />
                                      <span>Portofolio PDF:</span>
                                      {p.workOutputs
                                        .filter(w => w.type === 'pdf' || w.url?.startsWith('data:application/pdf') || w.fileName?.endsWith('.pdf'))
                                        .map((pdf, idx) => (
                                          <a
                                            key={idx}
                                            href={pdf.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={pdf.fileName || `${pdf.title}.pdf`}
                                            className="underline hover:text-[#1A1A1A] font-extrabold ml-1"
                                            title="Klik untuk membuka / mengunduh PDF"
                                          >
                                            {pdf.title || `Dokumen ${idx + 1}`} ↗
                                          </a>
                                        ))}
                                    </div>
                                  )}
                                  {p.workOutputs.filter(w => w.type !== 'pdf' && !w.url?.startsWith('data:application/pdf')).length > 0 && (
                                    <span className="rounded-lg bg-neutral-100 border border-[#1A1A1A]/20 px-2 py-0.5 text-[11px] font-bold text-[#1A1A1A]">
                                      🖼️ {p.workOutputs.filter(w => w.type !== 'pdf' && !w.url?.startsWith('data:application/pdf')).length} Foto Karya
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Approval Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => onRejectPending(p.id)}
                              className="brutal-btn flex items-center gap-1 bg-white text-[#FF5A5F] px-3 py-2 text-xs font-bold cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Tolak</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onApprovePending(p.id)}
                              className="brutal-btn flex items-center gap-1.5 bg-[#6B4EFE] px-4 py-2 text-xs font-black text-white cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Setujui & Publikasikan</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ACTIVE PROFILES DIRECTORY */}
              {activeTab === 'active' && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Cari nama, kota, kategori..."
                      className="w-full sm:w-72 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                    />

                    <span className="text-xs font-extrabold text-[#1A1A1A]">
                      Total: {filteredActive.length} mitra aktif
                    </span>
                  </div>

                  {/* Profiles Table */}
                  <div className="overflow-x-auto rounded-2xl border-2 border-[#1A1A1A] bg-white shadow-[4px_4px_0px_#1A1A1A]">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b-2 border-[#1A1A1A] bg-[#FDFCF8] text-[#1A1A1A] font-black">
                        <tr>
                          <th className="p-3">Mitra / Brand</th>
                          <th className="p-3">Kategori</th>
                          <th className="p-3">Kota</th>
                          <th className="p-3">Mulai Tarif</th>
                          <th className="p-3">WhatsApp</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-[#1A1A1A]/10 font-medium">
                        {filteredActive.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="p-3 flex items-center gap-2.5">
                              <img
                                src={p.avatar}
                                alt={p.name}
                                className="h-9 w-9 rounded-xl object-cover border border-[#1A1A1A] shrink-0"
                              />
                              <div>
                                <span className="font-heading font-black text-sm text-[#1A1A1A] block">{p.name}</span>
                                <span className="text-[11px] text-[#1A1A1A]/70">{p.title}</span>
                              </div>
                            </td>
                            <td className="p-3 capitalize font-bold text-[#6B4EFE]">{p.category}</td>
                            <td className="p-3 font-semibold text-[#1A1A1A]">{p.city}</td>
                            <td className="p-3 font-heading font-black text-[#1A1A1A]">
                              {formatRupiah(p.startingPrice)}
                            </td>
                            <td className="p-3 font-mono font-bold text-[#1A1A1A]">{p.whatsapp}</td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateActive({ ...p, verified: !p.verified });
                                }}
                                className={`rounded-md px-2 py-0.5 text-[10px] font-black border border-[#1A1A1A] cursor-pointer ${
                                  p.verified
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-neutral-100 text-neutral-500'
                                }`}
                              >
                                {p.verified ? 'Terverifikasi' : 'Biasa'}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingProfile(p)}
                                  className="brutal-btn p-1.5 bg-white text-[#1A1A1A] hover:bg-[#FFD166] cursor-pointer"
                                  title="Edit Profil"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Yakin ingin menghapus ${p.name}?`)) {
                                      onDeleteActive(p.id);
                                    }
                                  }}
                                  className="brutal-btn p-1.5 bg-white text-[#FF5A5F] hover:bg-rose-50 cursor-pointer"
                                  title="Hapus Profil"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: STATS & SETTINGS */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="brutal-card p-5 bg-white">
                      <span className="text-xs font-bold text-[#1A1A1A]/70">Total Mitra Aktif</span>
                      <p className="font-heading text-3xl font-black text-[#1A1A1A] mt-1">
                        {activeProfiles.length}
                      </p>
                    </div>

                    <div className="brutal-card p-5 bg-white">
                      <span className="text-xs font-bold text-[#1A1A1A]/70">Pengajuan Pending</span>
                      <p className="font-heading text-3xl font-black text-[#FF5A5F] mt-1">
                        {pendingProfiles.length}
                      </p>
                    </div>

                    <div className="brutal-card p-5 bg-white">
                      <span className="text-xs font-bold text-[#1A1A1A]/70">Total Klik Chat WhatsApp</span>
                      <p className="font-heading text-3xl font-black text-[#6B4EFE] mt-1">
                        {totalWhatsappClicks}
                      </p>
                    </div>

                    <div className="brutal-card p-5 bg-white">
                      <span className="text-xs font-bold text-[#1A1A1A]/70">Total Tayangan Profil</span>
                      <p className="font-heading text-3xl font-black text-[#1A1A1A] mt-1">
                        {totalViews}
                      </p>
                    </div>
                  </div>

                  {/* Admin info banner */}
                  <div className="brutal-card p-6 bg-white space-y-3">
                    <h4 className="font-heading text-base font-black text-[#1A1A1A]">Akun Pengelola</h4>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-medium">
                      Website ini dikelola langsung oleh <strong>@alifmurti_28</strong> (Email: <code>alifmurti28@gmail.com</code>).
                    </p>
                    <a
                      href="https://instagram.com/alifmurti_28"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutal-btn inline-flex items-center gap-1.5 bg-[#FFD166] px-4 py-2 text-xs font-black text-[#1A1A1A]"
                    >
                      <span>Kunjungi Instagram: @alifmurti_28</span>
                    </a>
                  </div>

                  {/* Backup & Data Actions */}
                  <div className="brutal-card p-6 bg-white space-y-4">
                    <h4 className="font-heading text-base font-black text-[#1A1A1A]">Manajemen & Pencadangan Data</h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleExportData}
                        className="brutal-btn flex items-center gap-1.5 bg-white px-4 py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Ekspor Backup JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Kembalikan semua profil ke data awal default? Tindakan ini akan menghapus data yang baru ditambahkan.')) {
                            onResetDefaults();
                          }
                        }}
                        className="brutal-btn flex items-center gap-1.5 bg-[#FFD166] px-4 py-2 text-xs font-black text-[#1A1A1A] cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Reset ke Data Demo Awal</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TRASH & REJECTED PROFILES */}
              {activeTab === 'trash' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-base font-black text-[#1A1A1A]">
                        Kotak Sampah: Arsip Pengajuan Ditolak & Mitra Dihapus
                      </h3>
                      <p className="text-xs text-[#1A1A1A]/70 font-medium">
                        Daftar profil yang pernah ditolak atau dihapus. Anda dapat memulihkannya kembali ke status aktif atau antrean kapan saja.
                      </p>
                    </div>
                  </div>

                  {trashProfiles.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[#1A1A1A]/30 p-12 text-center text-[#1A1A1A]/60 bg-white space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-[#1A1A1A]/40 border-2 border-[#1A1A1A]/20">
                        <Trash2 className="h-6 w-6" />
                      </div>
                      <h4 className="font-heading font-black text-sm text-[#1A1A1A]">Kotak Sampah Kosong</h4>
                      <p className="text-xs font-medium">Tidak ada pengajuan yang ditolak atau mitra yang dihapus saat ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {trashProfiles.map((p) => (
                        <div
                          key={p.id}
                          className="brutal-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-[#1A1A1A]"
                        >
                          <div className="flex items-start gap-3.5">
                            <img
                              src={p.avatar}
                              alt={p.name}
                              className="h-12 w-12 rounded-xl object-cover border-2 border-[#1A1A1A] shrink-0 grayscale opacity-80"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-heading font-black text-sm text-[#1A1A1A]">{p.name}</h4>
                                <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black text-[#FF5A5F] border border-[#FF5A5F]/40">
                                  Ditolak / Dihapus
                                </span>
                                <span className="rounded-md bg-[#FFD166]/50 px-2 py-0.5 text-[10px] uppercase font-black text-[#1A1A1A] border border-[#1A1A1A]/30">
                                  {p.category}
                                </span>
                              </div>
                              <p className="text-xs text-[#1A1A1A]/80 font-medium">{p.title}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#1A1A1A]/60 font-bold">
                                <span>Kota: {p.city}</span>
                                <span>·</span>
                                <span>WA: {p.whatsapp}</span>
                                <span>·</span>
                                <span>Mulai {formatRupiah(p.startingPrice)} /{p.priceUnit}</span>
                              </div>

                              {/* Portofolio & PDF Badges */}
                              {p.workOutputs && p.workOutputs.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  {p.workOutputs.some(w => w.type === 'pdf' || w.url?.startsWith('data:application/pdf') || w.fileName?.endsWith('.pdf')) && (
                                    <span className="rounded-md bg-rose-50 border border-[#FF5A5F]/30 px-1.5 py-0.5 text-[10px] font-bold text-[#FF5A5F] flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      <span>Lampiran PDF</span>
                                    </span>
                                  )}
                                  <span className="rounded-md bg-neutral-100 border border-[#1A1A1A]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#1A1A1A]/70">
                                    {p.pricePackages?.length || 0} Paket Layanan
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Restore & Permanent Delete Actions */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {onRestoreFromTrash && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onRestoreFromTrash(p.id, false)}
                                  className="brutal-btn flex items-center gap-1.5 bg-white text-[#1A1A1A] px-3 py-2 text-xs font-bold cursor-pointer hover:bg-neutral-50"
                                  title="Kembalikan ke antrean pengajuan baru"
                                >
                                  <Undo2 className="h-3.5 w-3.5 text-[#6B4EFE]" />
                                  <span>Ke Antrean</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onRestoreFromTrash(p.id, true)}
                                  className="brutal-btn flex items-center gap-1.5 bg-[#6B4EFE] text-white px-3.5 py-2 text-xs font-black cursor-pointer hover:bg-[#583bd8]"
                                  title="Pulihkan dan langsung berikan akses publik (mitra aktif)"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD166]" />
                                  <span>Pulihkan & Beri Akses</span>
                                </button>
                              </>
                            )}

                            {onDeletePermanentFromTrash && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Hapus permanen profil "${p.name}"? Data ini tidak dapat dipulihkan lagi.`)) {
                                    onDeletePermanentFromTrash(p.id);
                                  }
                                }}
                                className="brutal-btn p-2 bg-white text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white transition-colors cursor-pointer"
                                title="Hapus Permanen dari Kotak Sampah"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Edit Profile Submodal */}
      {editingProfile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border-3 border-[#1A1A1A] bg-white p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <h3 className="font-heading text-base font-black text-[#1A1A1A]">Edit Profil Mitra: {editingProfile.name}</h3>
              <button onClick={() => setEditingProfile(null)} className="brutal-btn p-1 bg-[#FF5A5F] text-white rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 font-bold">
              <div>
                <label className="block text-[#1A1A1A] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Spesialisasi / Title</label>
                <input
                  type="text"
                  value={editingProfile.title}
                  onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Kategori Layanan</label>
                <select
                  value={editingProfile.category}
                  onChange={(e) => setEditingProfile({ ...editingProfile, category: e.target.value as CategoryId })}
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={editingProfile.whatsapp}
                    onChange={(e) => setEditingProfile({ ...editingProfile, whatsapp: e.target.value })}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Kota</label>
                  <input
                    type="text"
                    value={editingProfile.city}
                    onChange={(e) => setEditingProfile({ ...editingProfile, city: e.target.value })}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={editingProfile.fullAddress}
                  onChange={(e) => setEditingProfile({ ...editingProfile, fullAddress: e.target.value })}
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Tarif Mulai (Rp)</label>
                  <input
                    type="number"
                    value={editingProfile.startingPrice}
                    onChange={(e) => setEditingProfile({ ...editingProfile, startingPrice: Number(e.target.value) })}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Satuan</label>
                  <input
                    type="text"
                    value={editingProfile.priceUnit}
                    onChange={(e) => setEditingProfile({ ...editingProfile, priceUnit: e.target.value })}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editingProfile.bio}
                  onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-medium"
                />
              </div>

              <div className="pt-3 border-t-2 border-[#1A1A1A]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="brutal-btn bg-white px-4 py-2 text-[#1A1A1A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="brutal-btn bg-[#6B4EFE] px-5 py-2 font-black text-white"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manual Submodal */}
      {isAddingManual && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border-3 border-[#1A1A1A] bg-white p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <h3 className="font-heading text-base font-black text-[#1A1A1A]">Tambah Mitra Baru (Input Manual Admin)</h3>
              <button onClick={() => setIsAddingManual(false)} className="brutal-btn p-1 bg-[#FF5A5F] text-white rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3 font-bold">
              <div>
                <label className="block text-[#1A1A1A] mb-1">Nama Mitra *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Contoh: Hendra Studio"
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Kategori *</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as CategoryId)}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Kota *</label>
                  <input
                    type="text"
                    required
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Spesialisasi / Title *</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Contoh: Jasa Pembuatan Video Iklan Komersial"
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={manualWhatsapp}
                    onChange={(e) => setManualWhatsapp(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] mb-1">Tarif Mulai (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={manualStartingPrice}
                    onChange={(e) => setManualStartingPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Alamat Workshop / Tempat Usaha *</label>
                <textarea
                  required
                  rows={2}
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Alamat lengkap usaha..."
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1">Deskripsi Singkat Keahlian</label>
                <textarea
                  rows={2}
                  value={manualBio}
                  onChange={(e) => setManualBio(e.target.value)}
                  placeholder="Pengalaman, spesialisasi, dll..."
                  className="w-full rounded-xl bg-white p-2.5 text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none font-medium"
                />
              </div>

              <div className="pt-3 border-t-2 border-[#1A1A1A]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingManual(false)}
                  className="brutal-btn bg-white px-4 py-2 text-[#1A1A1A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="brutal-btn bg-[#6B4EFE] px-5 py-2 font-black text-white"
                >
                  Tambahkan ke Direktori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
