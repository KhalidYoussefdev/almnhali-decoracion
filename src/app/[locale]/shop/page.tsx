'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn, getLocalizedField } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopPage() {
  const t = useTranslations('shop');
  const locale = useLocale();
  const settings = useSiteSettings();
  const categories = settings.categories;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, [searchParams]);
  const [sort, setSort] = useState<SortOption>('featured');
  const [search, setSearch] = useState('');
  const { products, loading } = useProducts();

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_ar.includes(q) ||
          p.tags.some((tag) => tag.includes(q))
      );
    }
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [products, selectedCategory, sort, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl text-navy dark:text-cream">{t('title')}</h1>
        <p className="mt-2 text-charcoal/60 dark:text-cream/60">
          {t('results', { count: filtered.length })}
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <aside className={cn(
          'lg:w-64 flex-shrink-0',
          filtersOpen ? 'block' : 'hidden lg:block'
        )}>
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-display text-lg">{t('filters')}</h3>
              <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2.5 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream focus:border-gold outline-none"
            />

            <div>
              <h4 className="text-sm font-semibold text-navy dark:text-cream mb-3">Category</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    'block w-full text-start px-3 py-2 rounded-lg text-sm transition-colors',
                    !selectedCategory ? 'bg-gold/20 text-navy font-medium' : 'hover:bg-beige dark:hover:bg-navy-700'
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'block w-full text-start px-3 py-2 rounded-lg text-sm transition-colors',
                      selectedCategory === cat.id ? 'bg-gold/20 text-navy font-medium' : 'hover:bg-beige dark:hover:bg-navy-700'
                    )}
                  >
                    {getLocalizedField(cat, 'name', locale)} ({products.filter((p) => p.category === cat.id).length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-beige-dark/50 rounded-lg"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters')}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream text-sm"
            >
              <option value="featured">{t('sort')}: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <p className="text-charcoal/60">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}