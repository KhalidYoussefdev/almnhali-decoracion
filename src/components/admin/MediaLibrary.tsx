'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Copy, Check, ImageIcon } from 'lucide-react';

export interface MediaItem {
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  selectLabel?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ onSelect, selectLabel = 'Use Image' }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) load();
  };

  const remove = async (url: string) => {
    if (!confirm('Delete this image from the server?')) return;
    await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    load();
  };

  const copyUrl = (url: string) => {
    const full = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 text-sm"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload New Image'}
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

      {loading ? (
        <p className="text-charcoal/60 text-center py-12">Loading media...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <ImageIcon className="h-12 w-12 text-charcoal/30 mx-auto" />
          <p className="mt-4 text-charcoal/60">No uploads yet. Click Upload to add images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.url} className="group relative bg-white rounded-xl border border-beige-dark/40 overflow-hidden">
              <div className="relative aspect-square">
                <Image src={item.url} alt={item.filename} fill className="object-cover" sizes="200px" unoptimized />
              </div>
              <div className="p-2">
                <p className="text-xs text-charcoal/70 truncate" title={item.filename}>{item.filename}</p>
                <p className="text-xs text-charcoal/40">{formatSize(item.size)}</p>
              </div>
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {onSelect && (
                  <button
                    type="button"
                    onClick={() => onSelect(item.url)}
                    className="px-3 py-1.5 bg-gold text-navy text-xs font-semibold rounded-lg"
                  >
                    {selectLabel}
                  </button>
                )}
                <button type="button" onClick={() => copyUrl(item.url)} className="p-2 bg-white/90 rounded-lg" title="Copy URL">
                  {copied === item.url ? <Check className="h-4 w-4 text-green-700" /> : <Copy className="h-4 w-4 text-navy" />}
                </button>
                <button type="button" onClick={() => remove(item.url)} className="p-2 bg-white/90 rounded-lg" title="Delete">
                  <Trash2 className="h-4 w-4 text-terracotta" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}