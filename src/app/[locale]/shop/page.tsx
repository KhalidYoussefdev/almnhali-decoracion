'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Search, X } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn, getLocalizedField } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/contexts/SettingsContext';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopPage() {
  const t = useTranslations('shop');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const settings = useSiteSettings();
  const categories = settings.categories;
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('featured');
  const [search, setSearch] = useState('');
  const { products, loading } = useProducts();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_ar.includes(q) ||
          p.tags.some((tag) => tag.includes(q)),
      );
    }
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [products, selectedCategory, sort, search]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
      {/* Compact header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-navy dark:text-cream">{t('title')}</h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-cream/60 mt-0.5">
            {t('results', { count: filtered.length })}
          </p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="self-start sm:self-auto px-3 py-2 rounded-lg border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream text-xs sm:text-sm"
        >
          <option value="featured">{t('sort')}: Featured</option>
          <option value="price-asc">{isAr ? 'السعر: الأقل' : 'Price: Low to High'}</option>
          <option value="price-desc">{isAr ? 'السعر: الأعلى' : 'Price: High to Low'}</option>
          <option value="rating">{isAr ? 'الأعلى تقييماً' : 'Top Rated'}</option>
        </select>
      </div>

      {/* Search — always visible */}
      <div className="relative mb-3">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'ابحث عن منتج...' : 'Search products...'}
          className="w-full ps-9 pe-9 py-2.5 rounded-xl border border-beige-dark/50 bg-white dark:bg-navy-700 dark:text-cream text-sm focus:border-gold outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 text-charcoal/40 hover:text-navy"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sticky category chips — easy navigation */}
      <div className="sticky top-16 md:top-[4.5rem] z-10 -mx-3 px-3 sm:-mx-4 sm:px-4 py-2 mb-4 bg-cream/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-beige-dark/20">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              !selectedCategory
                ? 'bg-navy text-cream dark:bg-gold dark:text-navy'
                : 'bg-white dark:bg-navy-700 text-navy dark:text-cream border border-beige-dark/40',
            )}
          >
            {isAr ? 'الكل' : 'All'} ({products.length})
          </button>
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap',
                  selectedCategory === cat.id
                    ? 'bg-navy text-cream dark:bg-gold dark:text-navy'
                    : 'bg-white dark:bg-navy-700 text-navy dark:text-cream border border-beige-dark/40',
                )}
              >
                {getLocalizedField(cat, 'name', locale)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dense product grid */}
      {loading ? (
        <p className="text-center text-charcoal/60 py-12 text-sm">
          {isAr ? 'جاري التحميل...' : 'Loading products...'}
        </p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-charcoal/60 text-sm">
            {isAr ? 'لا توجد منتجات' : 'No products found'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory(null);
            }}
            className="mt-3 text-sm text-gold font-semibold"
          >
            {isAr ? 'مسح الفلاتر' : 'Clear filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} compact />
          ))}
        </div>
      )}
    </div>
  );
}
