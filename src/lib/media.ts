import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const UPLOAD_URL_PREFIX = '/uploads/';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

export function isImageFilename(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

export function uploadUrlToFilename(url: string): string | null {
  if (!url.startsWith(UPLOAD_URL_PREFIX)) return null;
  const filename = url.slice(UPLOAD_URL_PREFIX.length);
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) return null;
  if (!isImageFilename(filename)) return null;
  return filename;
}