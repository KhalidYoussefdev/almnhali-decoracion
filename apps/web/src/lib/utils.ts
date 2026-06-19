import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLocalizedField(
  obj: object,
  field: string,
  locale: string
): string {
  const record = obj as Record<string, unknown>;
  const key = locale === 'ar' ? `${field}_ar` : `${field}_en`;
  return (record[key] as string) ?? (record[`${field}_en`] as string) ?? '';
}