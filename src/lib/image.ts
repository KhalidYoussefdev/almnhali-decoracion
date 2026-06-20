/** Normalize image paths — route uploads through API for reliable hosting */
export function normalizeImageSrc(src?: string | null): string | null {
  if (!src?.trim()) return null;
  let s = src.trim();

  if (s.startsWith('//')) return `https:${s}`;
  if (s.startsWith('uploads/')) s = `/${s}`;
  if (s.startsWith('/uploads/')) {
    return `/api/uploads/${s.slice('/uploads/'.length)}`;
  }
  if (s.startsWith('/api/uploads/')) return s;

  return s;
}

export function shouldUnoptimizeImage(src: string): boolean {
  return src.startsWith('/api/uploads/') || src.startsWith('/uploads/') || src.startsWith('/brand/');
}

export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}