import { getAsset } from '../services/assetService';

export { SafeMediaImage } from '../components/SafeMediaImage';

/**
 * Safely compress any image file (JPG, PNG, WebP, HEIC/HEIF, etc.) to a compact,
 * high-clarity JPEG data URL (typically 25 KB - 45 KB).
 * Robust against empty file.type on mobile browsers, canvas edge cases, and orientation.
 */
export function compressImage(
  file: File,
  maxDimension: number = 800,
  initialQuality: number = 0.65
): Promise<string> {
  return new Promise((resolve, reject) => {
    const isImageByExt = /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif|jfif|svg)$/i.test(file.name);
    const isImageByType = file.type.startsWith('image/');

    // If not an image (e.g. PDF), read as raw data URL
    if (!isImageByType && !isImageByExt) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Gagal membaca berkas'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('File kosong'));
        return;
      }

      const img = new Image();
      // If canvas loading fails, fallback to raw data URL so user file is never dropped
      img.onerror = () => {
        console.warn('Notice: Image canvas fallback used');
        resolve(rawDataUrl);
      };

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (!width || !height) {
            resolve(rawDataUrl);
            return;
          }

          // Scale down proportionally
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Progressive quality optimization:
          // Keep photo crisp while ensuring the base64 string stays well under 50KB (~60,000 chars)
          let q = initialQuality;
          let compressedUrl = canvas.toDataURL('image/jpeg', q);
          while (compressedUrl.length > 55000 && q > 0.35) {
            q -= 0.1;
            compressedUrl = canvas.toDataURL('image/jpeg', q);
          }

          resolve(compressedUrl);
        } catch (canvasErr) {
          console.warn('Canvas processing notice, using raw image', canvasErr);
          resolve(rawDataUrl);
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Read file as raw Data URL (for PDFs, etc.)
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Safely resolves an asset URL. If it's asset://id, loads from IndexedDB/Firestore.
 */
export async function resolveAssetUrl(urlOrAssetId?: string): Promise<string> {
  if (!urlOrAssetId) return '';
  if (urlOrAssetId.startsWith('asset://')) {
    const assetId = urlOrAssetId.replace(/^asset:\/\//, '');
    const fetched = await getAsset(assetId);
    return fetched || urlOrAssetId;
  }
  return urlOrAssetId;
}

/**
 * Safely open or download a PDF file from a base64 Data URL, asset ID, or remote URL.
 * Converts base64 to a Blob Object URL to bypass browser iframe & base64 navigation restrictions.
 */
export async function openOrDownloadPdf(
  urlOrAssetId: string,
  fileName: string = 'Portofolio.pdf'
): Promise<void> {
  try {
    if (!urlOrAssetId) return;

    let targetUrl = urlOrAssetId;

    // If it's an asset ID or key, retrieve from IndexedDB or Firestore cloud
    if (!targetUrl.startsWith('data:') && !targetUrl.startsWith('http')) {
      const fetched = await getAsset(targetUrl.replace(/^asset:\/\//, ''));
      if (fetched) targetUrl = fetched;
    }

    if (targetUrl.startsWith('data:application/pdf')) {
      const parts = targetUrl.split(';base64,');
      if (parts.length < 2) {
        window.open(targetUrl, '_blank');
        return;
      }

      const base64Data = parts[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      // Create download/open trigger
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    } else {
      // Remote web URL
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Error opening PDF document', error);
    window.open(urlOrAssetId, '_blank');
  }
}

/**
 * Format bytes to readable string (e.g. 250 KB, 1.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
