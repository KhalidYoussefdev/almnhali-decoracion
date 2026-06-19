'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Camera, RotateCcw, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

interface ARViewerProps {
  modelUrl?: string;
  productName: string;
}

export function ARViewer({ modelUrl, productName }: ARViewerProps) {
  const t = useTranslations('shop');
  const [active, setActive] = useState(false);

  const launchAR = () => {
    if (modelUrl && 'xr' in navigator) {
      setActive(true);
      // Production: integrate @google/model-viewer or 8th Wall / AR.js
    } else {
      setActive(true);
    }
  };

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-beige dark:bg-navy-700">
      {!active ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="p-6 rounded-2xl bg-white/80 dark:bg-navy-600 shadow-lg"
          >
            <Box className="h-16 w-16 text-gold" />
          </motion.div>
          <p className="text-center text-navy dark:text-cream font-display text-lg">
            {productName}
          </p>
          <p className="text-center text-sm text-charcoal/60 dark:text-cream/60 max-w-xs">
            Visualize this product in your room using augmented reality
          </p>
          <Button variant="gold" onClick={launchAR}>
            <Camera className="h-5 w-5" />
            {t('viewAR')}
          </Button>
        </div>
      ) : (
        <div className="absolute inset-0 bg-navy">
          {/* AR viewport placeholder — integrate model-viewer in production */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-cream p-8">
              <Box className="h-24 w-24 text-gold mx-auto mb-4 animate-float" />
              <p className="font-display text-xl mb-2">AR Mode Active</p>
              <p className="text-cream/70 text-sm mb-6">
                Point your camera at a flat surface to place {productName}
              </p>
              {modelUrl && (
                <p className="text-xs text-gold/60 font-mono">{modelUrl}</p>
              )}
            </div>
          </div>
          <div className="absolute bottom-4 inset-x-4 flex justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => setActive(false)}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="gold" size="sm">
              <Maximize2 className="h-4 w-4" /> Save Room
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}