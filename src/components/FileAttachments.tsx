import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilePlus, X, FileText, FileSpreadsheet, File as FileIcon, Download } from 'lucide-react';
import type { VendorFile } from '../types';

// Documents live in localStorage as base64 data URLs (no backend), so cap each
// file to keep the store within quota.
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.csv,application/pdf,application/msword,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
  'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function iconFor(file: VendorFile) {
  const name = file.name.toLowerCase();
  const type = file.type || '';
  if (type.includes('sheet') || /\.(xls|xlsx|csv)$/.test(name)) return FileSpreadsheet;
  if (type.includes('pdf') || type.includes('word') || type.includes('document') || /\.(pdf|doc|docx)$/.test(name)) {
    return FileText;
  }
  return FileIcon;
}

export function FileUploader({
  files,
  onChange,
}: {
  files: VendorFile[];
  onChange: (files: VendorFile[]) => void;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setError(null);
    const added: VendorFile[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_FILE_BYTES) {
        setError(t('common.fileTooLarge', { name: file.name }));
        continue;
      }
      try {
        added.push({ name: file.name, type: file.type, dataUrl: await readFileAsDataUrl(file) });
      } catch {
        /* skip unreadable file */
      }
    }
    if (added.length) onChange([...files, ...added]);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => {
            const Icon = iconFor(file);
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink"
              >
                <Icon size={14} className="shrink-0 text-blush-500" />
                <span className="max-w-[10rem] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onChange(files.filter((_, j) => j !== i))}
                  aria-label={t('common.delete')}
                  className="rounded-full p-0.5 text-ink-soft transition-colors hover:text-blush-600"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
      >
        <FilePlus size={14} />
        {t('common.addFile')}
      </button>
      {error && <p className="text-xs text-blush-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export function FileList({ files }: { files: VendorFile[] }) {
  if (!files || files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, i) => {
        const Icon = iconFor(file);
        return (
          <a
            key={i}
            href={file.dataUrl}
            download={file.name}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink transition-colors hover:border-blush-300"
          >
            <Icon size={14} className="shrink-0 text-blush-500" />
            <span className="max-w-[12rem] truncate">{file.name}</span>
            <Download size={12} className="text-ink-soft" />
          </a>
        );
      })}
    </div>
  );
}
