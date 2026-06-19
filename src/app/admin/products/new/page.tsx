import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-navy mb-8">Add New Product</h1>
      <ProductForm />
    </div>
  );
}