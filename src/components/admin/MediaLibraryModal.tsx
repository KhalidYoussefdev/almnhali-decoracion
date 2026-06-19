'use client';

import { X } from 'lucide-react';
import { MediaLibrary } from './MediaLibrary';

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  selectLabel?: string;
}

export function MediaLibraryModal({ open, onClose, onSelect, selectLabel = 'Use Image' }: MediaLibraryModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-cream rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-beige-dark/40">
          <div>
            <h2 className="font-display text-2xl text-navy">Media Library</h2>
            <p className="text-sm text-charcoal/60 mt-0.5">Select an image or upload a new one</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-beige rounded-lg">
            <X className="h-5 w-5 text-navy" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <MediaLibrary
            onSelect={onSelect ? (url) => { onSelect(url); onClose(); } : undefined}
            selectLabel={selectLabel}
          />
        </div>
      </div>
    </div>
  );
}