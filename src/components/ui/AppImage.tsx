'use client';

import Image, { type ImageProps } from 'next/image';
import { normalizeImageSrc, shouldUnoptimizeImage } from '@/lib/image';

type AppImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
};

export function AppImage({ src, alt = '', className, ...props }: AppImageProps) {
  const normalized = normalizeImageSrc(src);

  if (!normalized) {
    return (
      <div
        className={`bg-beige dark:bg-navy-700 flex items-center justify-center ${className ?? ''} ${props.fill ? 'absolute inset-0' : ''}`}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={normalized}
      alt={alt}
      className={className}
      unoptimized={shouldUnoptimizeImage(normalized)}
      {...props}
    />
  );
}