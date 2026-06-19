import { Hero } from '@/components/home/Hero';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BentoGallery } from '@/components/home/BentoGallery';
import { TrustSignals } from '@/components/home/TrustSignals';
import { BestsellersSection } from '@/components/home/BestsellersSection';
import { getAllProducts } from '@/data/products';

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestsellersSection products={featured} />
      <BentoGallery />
      <TrustSignals />
    </>
  );
}