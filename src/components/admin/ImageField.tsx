'use client';

import { useRef, useState } from 'react';
import { AppImage } from '@/components/ui/AppImage';
import { Upload, X, Images } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export function ImageField({ label, value, onChange, hint }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? 'Upload failed');
      return;
    }
    onChange(data.url);
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
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-3 bg-navy text-cream rounded-xl hover:opacity-90 disabled:opacity-50 text-sm shrink-0"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
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