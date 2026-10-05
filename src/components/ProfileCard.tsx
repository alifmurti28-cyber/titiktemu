import React from 'react';
import { WorkerProfile } from '../types';
import { formatRupiah } from '../utils/storage';
import { 
  Star, MapPin, CheckCircle2, MessageCircle, 
  Heart, ArrowUpRight, Image as ImageIcon, FileText 
} from 'lucide-react';

interface ProfileCardProps {
  profile: WorkerProfile;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProfile: (profile: WorkerProfile) => void;
  onWhatsAppClick: (profile: WorkerProfile, e: React.MouseEvent) => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFavorite,
  onToggleFavorite,
  onSelectProfile,
  onWhatsAppClick,
  onOpenLightbox
}) => {
  const displayImage = profile.workOutputs?.find(w => w.type !== 'pdf' && !w.url?.startsWith('data:application/pdf') && !w.url?.startsWith('asset://'))?.url || profile.coverImage || profile.avatar;
  const hasPdf = profile.workOutputs?.some(w => w.type === 'pdf' || w.url?.startsWith('data:application/pdf') || w.url?.startsWith('asset://') || w.fileName?.endsWith('.pdf'));

  return (
    <article 
      onClick={() => onSelectProfile(profile)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border-2 border-[#1A1A1A] bg-white shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#1A1A1A] hover:-translate-y-2 transition-all duration-200 cursor-pointer p-5"
    >
      <div>
        {/* Top Header inside Card */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-[#1A1A1A] shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A] group-hover:text-[#6B4EFE] transition-colors leading-tight">
                {profile.name}
              </h3>
              <p className="text-xs font-extrabold text-[#6B4EFE] mt-0.5 line-clamp-1">
                {profile.businessName || profile.title}
              </p>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(profile.id);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#1A1A1A] transition-all cursor-pointer ${
              isFavorite 
                ? 'bg-[#FF5A5F] text-white' 
                : 'bg-white text-[#1A1A1A] hover:bg-[#FFD166]'
            }`}
            title={isFavorite ? 'Hapus dari koleksi' : 'Simpan ke koleksi'}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Media / Work Showcase Box */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border-2 border-[#1A1A1A] bg-neutral-100 my-2">
          <img
            src={displayImage}
            alt={`Portofolio ${profile.name} - ${profile.title}`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Floating Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-black text-[#1A1A1A] border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <span className="capitalize">{profile.category}</span>
            {profile.verified && (
              <>
                <span className="text-[#1A1A1A]/30">·</span>
                <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Terverifikasi</span>
                </span>
              </>
            )}
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
            {hasPdf && (
              <div className="rounded-lg bg-[#FF5A5F] px-2 py-0.5 text-[10px] font-black text-white shadow-sm flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>PDF</span>
              </div>
            )}
            {profile.workOutputs && profile.workOutputs.length > 0 && (
              <div className="rounded-lg bg-[#1A1A1A]/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                <span>{profile.workOutputs.length} Berkas</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio preview */}
        <p className="mt-3 text-xs text-[#1A1A1A]/80 font-medium line-clamp-2 leading-relaxed">
          {profile.bio}
        </p>

        {/* City and Rating Info Row */}
        <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#1A1A1A]/70 pt-2 border-t border-[#1A1A1A]/10">
          <div className="flex items-center gap-1 text-[#1A1A1A]">
            <MapPin className="h-3.5 w-3.5 text-[#FF5A5F]" />
            <span>{profile.city}</span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-[#FFD166] px-2 py-0.5 text-[11px] font-black text-[#1A1A1A] border border-[#1A1A1A]">
            <Star className="h-3 w-3 fill-current text-[#1A1A1A]" />
            <span>{profile.rating.toFixed(1)}</span>
            <span className="text-[10px] opacity-70">({profile.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Footer Area: Price & Action Buttons */}
      <div className="mt-4 pt-3 border-t-2 border-[#1A1A1A]/15 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-[#1A1A1A]/60">Mulai dari</span>
          <div className="text-right">
            <span className="font-heading font-black text-lg text-[#1A1A1A]">
              {formatRupiah(profile.startingPrice)}
            </span>
            <span className="text-xs font-bold text-[#1A1A1A]/60 ml-1">
              /{profile.priceUnit}
            </span>
          </div>
        </div>

        {/* Buttons Row (Variation 4 full-width Coral Red Chat WhatsApp button) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => onWhatsAppClick(profile, e)}
            className="brutal-btn flex-1 flex items-center justify-center gap-2 bg-[#FF5A5F] py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProfile(profile);
            }}
            className="brutal-btn flex h-11 w-11 items-center justify-center bg-[#FFD166] text-[#1A1A1A] cursor-pointer shrink-0"
            title="Lihat Detail & Price List Lengkap"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
