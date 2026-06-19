'use client';

import { MediaLibrary } from './MediaLibrary';

export function MediaLibraryPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl text-navy">Media Library</h1>
      <p className="text-charcoal/60 mt-1 mb-6">Browse, upload, copy URLs, and delete images stored on your server</p>
      <MediaLibrary />
    </div>
  );
}