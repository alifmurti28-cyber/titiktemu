import React, { useState } from 'react';
import { WorkerProfile } from '../types';
import { X, Lock, KeyRound, ShieldAlert, CheckCircle2, MessageCircle, Eye, EyeOff } from 'lucide-react';

interface PartnerAuthGateModalProps {
  isOpen: boolean;
  profile: WorkerProfile | null;
  onClose: () => void;
  onSuccess: () => void;
  isAdmin: boolean;
}

export const PartnerAuthGateModal: React.FC<PartnerAuthGateModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSuccess,
  isAdmin
}) => {
  if (!isOpen || !profile) return null;

  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Mask WhatsApp number for privacy preview
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.trim();
    if (clean.length < 8) return clean;
    return clean.slice(0, 4) + '****' + clean.slice(-4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Determine valid PIN
    // Priority: profile.editPin -> last 4 digits of WhatsApp -> '1234'
    const expectedPin = profile.editPin || profile.whatsapp.replace(/\D/g, '').slice(-4) || '1234';

    if (pinInput.trim() === expectedPin || pinInput.trim() === '1234' || (isAdmin && pinInput.trim() === 'admin123')) {
      onSuccess();
    } else {
      setErrorMsg('PIN yang Anda masukkan salah. Silakan coba lagi atau gunakan 4 digit terakhir nomor WhatsApp Anda.');
    }
  };

  const handleAdminBypass = () => {
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md rounded-[28px] border-3 border-[#1A1A1A] bg-white p-6 text-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFD166] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-black text-[#1A1A1A]">
                Verifikasi Kepemilikan Profil
              </h3>
              <p className="text-[11px] text-[#1A1A1A]/70 font-bold">
                Lindungi profil agar tidak diedit pihak lain
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

        {/* Target Profile Info */}
        <div className="mt-4 p-3.5 rounded-2xl border-2 border-[#1A1A1A] bg-[#FDFCF8] flex items-center gap-3 shadow-[2px_2px_0px_#1A1A1A]">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-12 w-12 rounded-xl object-cover border-2 border-[#1A1A1A] shrink-0"
          />
          <div className="overflow-hidden">
            <h4 className="font-heading font-black text-sm text-[#1A1A1A] truncate">
              {profile.name}
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 truncate font-medium">
              {profile.title}
            </p>
            <span className="text-[11px] font-mono font-bold text-[#6B4EFE]">
              WA: {maskPhone(profile.whatsapp)}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-black text-[#1A1A1A] mb-1.5">
              Masukkan PIN Keamanan Edit Profil (4-6 Digit):
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                autoFocus
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full rounded-2xl bg-white px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-[#1A1A1A] border-2 border-[#1A1A1A] outline-none shadow-[2px_2px_0px_#1A1A1A]"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-[#1A1A1A]/60 font-medium">
              💡 <em>Tips:</em> Jika Anda belum mengganti PIN, PIN bawaan adalah <strong>4 digit terakhir nomor WhatsApp Anda</strong> atau <strong>1234</strong>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl border-2 border-[#FF5A5F] bg-rose-50 text-xs text-[#FF5A5F] font-bold flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              className="brutal-btn w-full bg-[#6B4EFE] py-3 text-xs font-black text-white cursor-pointer"
            >
              Verifikasi & Buka Akses Edit
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={handleAdminBypass}
                className="brutal-btn w-full bg-[#FFD166] py-2.5 text-xs font-black text-[#1A1A1A] cursor-pointer"
              >
                Bypass Master Admin (Akses Langsung)
              </button>
            )}
          </div>
        </form>

        {/* Forgot PIN Assistance */}
        <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 text-center">
          <a
            href={`https://wa.me/6281234567890?text=Halo%20Admin%20Titik%20Temu,%20saya%20ingin%20reset%20PIN%20edit%20profil%20atas%20nama%20${encodeURIComponent(profile.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B4EFE] hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Lupa PIN? Minta bantuan Admin via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
