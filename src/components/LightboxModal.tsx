import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="brutal-btn absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5A5F] text-white border-2 border-[#1A1A1A] cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="overflow-hidden rounded-2xl border-3 border-[#1A1A1A] bg-black shadow-[8px_8px_0px_#1A1A1A]">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-h-[80vh] w-auto object-contain"
          />
        </div>

        {title && (
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-white drop-shadow">
              {title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
