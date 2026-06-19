'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact';
  theme?: 'light' | 'dark';
}

export function Logo({ className, variant = 'full', theme = 'light' }: LogoProps) {
  const isDark = theme === 'dark';

  return (
    <div className={cn('flex flex-col', className)}>
      <span
        className={cn(
          'font-display font-bold tracking-tight',
          variant === 'full' ? 'text-2xl md:text-3xl' : 'text-xl',
          isDark ? 'text-white' : 'text-navy'
        )}
      >
        Almnhali
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
          المنهالي للديكور
        </span>
      )}
      <div className="h-0.5 w-12 bg-gold-gradient mt-1 rounded-full" aria-hidden />
    </div>
  );
}