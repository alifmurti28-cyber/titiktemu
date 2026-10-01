import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md' 
}) => {
  const badgeSize = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-13 w-13' : 'h-11 w-11';
  const svgSize = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-8 w-8' : 'h-7 w-7';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl sm:text-2xl';

  return (
    <div className="group inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none">
      {/* Neo-brutalist Letter 'T' Emblem Badge */}
      <div 
        className={`relative flex items-center justify-center rounded-2xl bg-[#FFD166] border-2.5 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0px_#1A1A1A] transition-all duration-200 shrink-0 ${badgeSize}`}
      >
        {/* Playful mini accent sticker */}
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#ff7600] border-2 border-[#1A1A1A]" />

        {/* Stylized Aesthetic Neo-Brutalist Letter 'T' */}
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`${svgSize} transition-transform group-hover:scale-105 duration-200`}
        >
          {/* 3D Offset / Shadow for the Letter T */}
          <path 
            d="M8 9H34V16H25V33H17V16H8V9Z" 
            fill="#ff7600" 
          />
          {/* Main Geometric Bold T */}
          <path 
            d="M6 7H32V14H23V31H15V14H6V7Z" 
            fill="#1A1A1A" 
          />
          {/* Inner Highlight 'Titik' Accent */}
          <circle cx="28.5" cy="7.5" r="2" fill="#FFD166" />
        </svg>
      </div>

      {/* TitikTemu Unified Wordmark Centered Beside Logo */}
      <span className={`font-heading font-black tracking-tight text-[#1A1A1A] leading-none select-none ${textSize}`}>
        Titik<span className="text-[#ff7600] group-hover:text-[#6B4EFE] transition-colors">Temu</span>
      </span>
    </div>
  );
};
