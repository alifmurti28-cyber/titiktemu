import React, { useState, useEffect } from 'react';
import { getAsset } from '../services/assetService';

export interface SafeMediaImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
}

/**
 * React Component for bulletproof image rendering.
 * Safely handles standard URLs, base64 data URLs, and seamlessly resolves
 * any asset:// references asynchronously from IndexedDB/Firestore.
 */
export const SafeMediaImage: React.FC<SafeMediaImageProps> = ({
  src,
  alt = 'Media',
  className = 'h-full w-full object-cover',
  fallbackSrc = 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  onClick
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (src && !src.startsWith('asset://')) return src;
    return '';
  });

  useEffect(() => {
    if (!src) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    if (src.startsWith('asset://')) {
      const cleanId = src.replace(/^asset:\/\//, '');
      getAsset(cleanId)
        .then((data) => {
          if (data) {
            setCurrentSrc(data);
          } else {
            setCurrentSrc(fallbackSrc);
          }
        })
        .catch(() => {
          setCurrentSrc(fallbackSrc);
        });
    } else {
      setCurrentSrc(src);
    }
  }, [src, fallbackSrc]);

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onClick={onClick}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
};
