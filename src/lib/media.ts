import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
export const LEGACY_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const UPLOAD_URL_PREFIX = '/api/uploads/';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

export const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/jpg',
  'image/pjpeg',
]);

export function isImageFilename(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

export function getImageExtension(filename: string): string | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return null;
  return ext;
}

export function isAllowedImageUpload(file: File): boolean {
  if (file.type && ALLOWED_IMAGE_MIMES.has(file.type)) return true;
  return getImageExtension(file.name) !== null;
}

export function uploadUrlToFilename(url: string): string | null {
  const prefixes = [UPLOAD_URL_PREFIX, '/uploads/'];
  const prefix = prefixes.find((p) => url.startsWith(p));
  if (!prefix) return null;
  const relative = url.slice(prefix.length).replace(/\\/g, '/');
  if (!relative || relative.includes('..')) return null;
  if (!isImageFilename(path.basename(relative))) return null;
  return relative;
}

export function uploadDirs(): string[] {
  return [UPLOAD_DIR, LEGACY_UPLOAD_DIR];
}