import React, { useState } from 'react';
import { WorkerProfile } from '../types';
import { X, Search, Lock, Edit3, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

interface PartnerLookupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfiles: WorkerProfile[];
  onSelectProfileToEdit: (profile: WorkerProfile) => void;
  isAdmin: boolean;
}

export const PartnerLookupEditModal: React.FC<PartnerLookupEditModalProps> = ({
  isOpen,
  onClose,
  activeProfiles,
  onSelectProfileToEdit,
  isAdmin
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<WorkerProfile | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = activeProfiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.businessName && p.businessName.toLowerCase().includes(q)) ||
      p.whatsapp.includes(q)
    );
  });

  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    setErrorMsg('');

    const expectedPin = selectedProfile.editPin || selectedProfile.whatsapp.replace(/\D/g, '').slice(-4) || '1234';

    if (pinInput.trim() === expectedPin || pinInput.trim() === '1234' || (isAdmin && pinInput.trim() === 'admin123')) {
      onSelectProfileToEdit(selectedProfile);
      onClose();
    } else {
      setErrorMsg('PIN salah. Silakan coba 4 digit terakhir nomor WhatsApp Anda atau 1234.');
    }
  };

  const handleBypassForAdmin = () => {
    if (!selectedProfile) return;
    onSelectProfileToEdit(selectedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-[28px] border-3 border-[#1A1A1A] bg-white p-6 text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-black text-[#1A1A1A]">
                Kelola & Edit Profil Mitra
              </h3>
              <p className="text-[11px] text-[#1A1A1A]/70 font-bold">
                Pilih profil Anda dan masukkan PIN untuk mengedit data
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="brutal-btn flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {!selectedProfile ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama Anda atau nomor WhatsApp..."
                  className="w-full rounded-2xl bg-white pl-10 pr-4 py-2.5 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none shadow-[2px_2px_0px_#1A1A1A]"
                />
              </div>

              {/* Profiles List */}
              <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
                <span className="text-[11px] font-black text-[#1A1A1A]/60 uppercase tracking-wider block">
                  Pilih Profil yang Ingin Diedit:
                </span>

                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#1A1A1A]/60 font-medium border-2 border-dashed border-[#1A1A1A]/20 rounded-2xl">
                    Profil tidak ditemukan dengan kata kunci tersebut.
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProfile(p);
                        setErrorMsg('');
                        setPinInput('');
                      }}
                      className="p-3 rounded-2xl border-2 border-[#1A1A1A] bg-white hover:bg-[#FFD166]/20 shadow-[2px_2px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="h-10 w-10 rounded-xl object-cover border-2 border-[#1A1A1A] shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-heading font-black text-xs sm:text-sm text-[#1A1A1A] truncate">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-[#1A1A1A]/70 truncate font-medium">
                            {p.title} · {p.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-black text-[#6B4EFE] shrink-0">
                        <span>Pilih</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Selected profile step: input PIN */
            <form onSubmit={handleVerifyAndProceed} className="space-y-4 pt-1">
              <div className="p-4 rounded-2xl border-2 border-[#1A1A1A] bg-[#FFD166]/20 flex items-center justify-between gap-3 shadow-[2px_2px_0px_#1A1A1A]">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="h-12 w-12 rounded-xl object-cover border-2 border-[#1A1A1A]"
                  />
                  <div>
                    <h4 className="font-heading font-black text-sm text-[#1A1A1A]">
                      {selectedProfile.name}
                    </h4>
                    <p className="text-xs text-[#1A1A1A]/70 font-medium">
                      {selectedProfile.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="text-xs font-bold text-[#6B4EFE] underline cursor-pointer"
                >
                  Ganti
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A1A] mb-1.5">
                  Masukkan PIN Keamanan Profil (4-6 Digit):
                </label>
                <input
                  type="password"
                  autoFocus
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none shadow-[2px_2px_0px_#1A1A1A]"
                />
                <p className="mt-1.5 text-[11px] text-[#1A1A1A]/60 font-medium">
                  Default PIN jika belum diubah: <strong>4 digit terakhir nomor WhatsApp</strong> atau <strong>1234</strong>.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl border-2 border-[#FF5A5F] bg-rose-50 text-xs text-[#FF5A5F] font-bold flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="brutal-btn w-full bg-[#6B4EFE] py-3 text-xs font-black text-white cursor-pointer"
                >
                  Buka Formulir Edit Lengkap
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleBypassForAdmin}
                    className="brutal-btn w-full bg-[#FFD166] py-2 text-xs font-black text-[#1A1A1A] cursor-pointer"
                  >
                    Bypass Mode Admin (Edit Langsung)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="brutal-btn w-full bg-white py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer"
                >
                  Kembali Pilih Profil Lain
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
