import { getSettings } from '@/lib/data-store';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSettings();
  const isAr = locale === 'ar';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 prose dark:prose-invert">
      <h1 className="font-display text-4xl text-navy dark:text-cream">
        {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
      </h1>
      <p className="text-charcoal/70 dark:text-cream/70 mt-4">
        {isAr ? 'آخر تحديث: يونيو 2026' : 'Last updated: June 2026'}
      </p>

      {isAr ? (
        <>
          <p>
            {settings.brand.name_ar} ({settings.brand.name_en}) تحترم خصوصيتك. نجمع فقط البيانات اللازمة لتقديم خدماتنا في
            الدمام والمنطقة الشرقية.
          </p>
          <h2>البيانات التي نجمعها</h2>
          <ul>
            <li>الاسم والبريد الإلكتروني ورقم الهاتف عند التسجيل أو الشراء</li>
            <li>عنوان الشحن لإتمام الطلبات</li>
            <li>بيانات الاستخدام الأساسية لتحسين الموقع والتطبيق</li>
          </ul>
          <h2>كيف نستخدم بياناتك</h2>
          <ul>
            <li>معالجة الطلبات والتوصيل</li>
            <li>التواصل بخصوص المنتجات والدعم</li>
            <li>تحسين تجربة التسوق والمعاينة بالواقع المعزز</li>
          </ul>
          <h2>التواصل</h2>
          <p>
            للاستفسارات: {settings.contact.email} | {settings.contact.phone}
          </p>
        </>
      ) : (
        <>
          <p>
            {settings.brand.name_en} respects your privacy. We only collect data necessary to serve customers in Dammam
            and the Eastern Province.
          </p>
          <h2>Data We Collect</h2>
          <ul>
            <li>Name, email, and phone when you register or checkout</li>
            <li>Shipping address to fulfill orders</li>
            <li>Basic usage data to improve our website and mobile app</li>
          </ul>
          <h2>How We Use Your Data</h2>
          <ul>
            <li>Process orders and deliveries</li>
            <li>Contact you about products and support</li>
            <li>Improve shopping and AR preview experiences</li>
          </ul>
          <h2>Contact</h2>
          <p>
            Questions: {settings.contact.email} | {settings.contact.phone}
          </p>
        </>
      )}
    </div>
  );
}