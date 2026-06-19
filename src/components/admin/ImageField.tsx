'use client';

import { useId, useState } from 'react';
import { AppImage } from '@/components/ui/AppImage';
import { Upload, X, Images } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { uploadImageFile } from '@/lib/upload-client';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const FILE_ACCEPT = 'image/*,.jpg,.jpeg,.png,.webp,.gif,.svg';

export function ImageField({ label, value, onChange, hint }: ImageFieldProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const { url } = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      {value && (
        <div className="relative mt-2 w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-beige-dark bg-beige/30">
          <AppImage src={value} alt="" fill className="object-cover" sizes="320px" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 end-2 p-1 bg-navy/70 rounded-full text-white hover:bg-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL or upload from PC"
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-beige text-navy rounded-xl hover:bg-beige-dark/30 text-sm shrink-0"
        >
          <Images className="h-4 w-4" />
          Library
        </button>
        <label
          htmlFor={inputId}
          className={`flex items-center gap-2 px-4 py-3 bg-navy text-cream rounded-xl hover:opacity-90 text-sm shrink-0 cursor-pointer ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload'}
        </label>
        <input
          id={inputId}
          type="file"
          accept={FILE_ACCEPT}
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {hint && <p className="text-xs text-charcoal/50 mt-1">{hint}</p>}
      {error && <p className="text-xs text-terracotta mt-1">{error}</p>}

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}