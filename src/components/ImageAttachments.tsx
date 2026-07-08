import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { fileToCompressedDataUrl } from '../lib/image';

// Edit-mode grid: thumbnails with remove buttons + an add-image tile.
export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        added.push(await fileToCompressedDataUrl(file));
      } catch {
        /* skip files the browser can't decode (e.g. HEIC) */
      }
    }
    if (added.length) onChange([...images, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((src, i) => (
        <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-line">
          <img src={src} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            aria-label={t('common.delete')}
            className="absolute right-1 top-1 rounded-full bg-ink/60 p-0.5 text-white transition-colors hover:bg-ink/80"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-xs text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} strokeWidth={1.75} />}
        {t('common.addImage')}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

// View-mode thumbnails that open a full-size lightbox on click.
export function ImageGallery({ images }: { images: string[] }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={t('common.openImage')}
            className="h-16 w-16 overflow-hidden rounded-lg border border-line transition-transform hover:scale-105"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <div
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label={t('common.close')}
            className="absolute right-4 top-4 rounded-full bg-paper/90 p-2 text-ink shadow-soft"
          >
            <X size={18} />
          </button>
          <img
            src={images[openIndex]}
            alt=""
            className="max-h-full max-w-full rounded-lg object-contain shadow-soft"
          />
        </div>
      )}
    </>
  );
}
