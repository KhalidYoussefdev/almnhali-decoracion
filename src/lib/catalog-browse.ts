import type { Product, SiteSettings } from '@/types/product';

export interface CatalogCategoryCard {
  id: string;
  name_en: string;
  name_ar: string;
  name_zh?: string;
  image: string;
  count: number;
}

/** Cover image per category — first product image in that category */
export function buildCatalogCards(
  categories: SiteSettings['categories'],
  products: Product[],
): CatalogCategoryCard[] {
  return categories.map((cat) => {
    const inCat = products.filter((p) => p.category === cat.id);
    const image =
      inCat[0]?.images[0] ??
      '/api/uploads/catalog/wpc-wall-panel/wpc-wall-panel-0001.jpg';
    return {
      id: cat.id,
      name_en: cat.name_en,
      name_ar: cat.name_ar,
      image,
      count: inCat.length,
    };
  });
}

export function getProductsByCategory(products: Product[], categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId);
}
