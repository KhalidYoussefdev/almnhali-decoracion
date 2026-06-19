'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { AppImage } from '@/components/ui/AppImage';
import { Upload, Trash2, Copy, Check, ImageIcon } from 'lucide-react';
import { uploadImageFile } from '@/lib/upload-client';

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

const FILE_ACCEPT = 'image/*,.jpg,.jpeg,.png,.webp,.gif,.svg';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ onSelect, selectLabel = 'Use Image' }: MediaLibraryProps) {
  const inputId = useId();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/media', { credentials: 'include' })
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      await uploadImageFile(file);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (url: string) => {
    if (!confirm('Delete this image from the server?')) return;
    await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ url }),
    });
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
      <div className="flex flex-col items-end gap-2 mb-4">
        <label
          htmlFor={inputId}
          className={`flex items-center gap-2 px-4 py-2 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 text-sm cursor-pointer ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload New Image'}
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
        {error && <p className="text-xs text-terracotta">{error}</p>}
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
                <AppImage src={item.url} alt={item.filename} fill className="object-cover" sizes="200px" />
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