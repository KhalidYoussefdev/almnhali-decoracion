import { Hero } from '@/components/home/Hero';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BentoGallery } from '@/components/home/BentoGallery';
import { TrustSignals } from '@/components/home/TrustSignals';
import { ProductCard } from '@/components/ui/ProductCard';
import { products } from '@/data/products';

export default function HomePage() {
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <>
      <Hero />
      <FeaturedCollections />
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">Featured</span>
              <h2 className="font-display text-3xl md:text-5xl text-navy dark:text-cream mt-2">
                Bestsellers
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
      <BentoGallery />
      <TrustSignals />
    </>
  );
}