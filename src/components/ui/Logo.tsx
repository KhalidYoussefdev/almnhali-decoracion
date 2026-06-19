'use client';

import { AppImage } from '@/components/ui/AppImage';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/contexts/SettingsContext';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact';
  theme?: 'light' | 'dark';
}

export function Logo({ className, variant = 'full', theme = 'light' }: LogoProps) {
  const settings = useSiteSettings();
  const isDark = theme === 'dark';

  if (settings.brand.logo) {
    return (
      <div className={cn('relative', variant === 'full' ? 'h-12 w-40' : 'h-8 w-28', className)}>
        <AppImage
          src={settings.brand.logo}
          alt={settings.brand.name_en}
          fill
          className="object-contain object-start"
          sizes="160px"
        />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <span
        className={cn(
          'font-display font-bold tracking-tight',
          variant === 'full' ? 'text-2xl md:text-3xl' : 'text-xl',
          isDark ? 'text-white' : 'text-navy'
        )}
      >
        {settings.brand.name_en}
        <span className="text-gold"> Decoración</span>
      </span>
      {variant === 'full' && (
        <span
          className={cn(
            'font-arabic text-xs tracking-widest mt-0.5',
            isDark ? 'text-gold-light' : 'text-gold-dark'
          )}
          dir="rtl"
        >
          {settings.brand.name_ar}
        </span>
      )}
      <div className="h-0.5 w-12 bg-gold-gradient mt-1 rounded-full" aria-hidden />
    </div>
  );
}