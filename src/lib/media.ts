import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const UPLOAD_URL_PREFIX = '/api/uploads/';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

export function isImageFilename(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

export function uploadUrlToFilename(url: string): string | null {
  const prefixes = [UPLOAD_URL_PREFIX, '/uploads/'];
  const prefix = prefixes.find((p) => url.startsWith(p));
  if (!prefix) return null;
  const filename = url.slice(prefix.length);
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) return null;
  if (!isImageFilename(filename)) return null;
  return filename;
}