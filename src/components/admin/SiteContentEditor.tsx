'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CategoryItem, CollectionItem, GalleryItem, MoodBoard, SiteSettings } from '@/types/product';
import { ImageField } from './ImageField';

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

type Tab = 'brand' | 'hero' | 'homepage' | 'collections' | 'inspiration' | 'footer' | 'text' | 'seo' | 'theme';

const TABS: { id: Tab; label: string }[] = [
  { id: 'brand', label: 'Brand & Logo' },
  { id: 'hero', label: 'Hero' },
  { id: 'homepage', label: 'Homepage' },
  { id: 'collections', label: 'Collections' },
  { id: 'inspiration', label: 'Inspiration' },
  { id: 'footer', label: 'Footer & Contact' },
  { id: 'text', label: 'All Site Text' },
  { id: 'seo', label: 'SEO' },
  { id: 'theme', label: 'Colors & Banner' },
];

const MESSAGE_SECTIONS: { key: string; label: string; fields: string[] }[] = [
  { key: 'nav', label: 'Navigation', fields: ['shop', 'collections', 'inspiration', 'about', 'search', 'cart', 'account', 'wishlist'] },
  { key: 'shop', label: 'Shop', fields: ['title', 'filters', 'sort', 'results', 'addToCart', 'viewAR', 'completeLook', 'reviews'] },
  { key: 'cart', label: 'Cart', fields: ['title', 'empty', 'subtotal', 'shipping', 'total', 'checkout', 'freeShipping'] },
  { key: 'checkout', label: 'Checkout', fields: ['title', 'shipping', 'payment', 'placeOrder', 'mada', 'applePay', 'stcPay', 'tabby'] },
  { key: 'account', label: 'Account', fields: ['title', 'orders', 'wishlist', 'savedRooms', 'settings', 'logout'] },
  { key: 'ai', label: 'AI Assistant', fields: ['title', 'placeholder', 'greeting'] },
  { key: 'trust', label: 'Trust Signals', fields: ['delivery', 'quality', 'returns', 'support'] },
  { key: 'footer', label: 'Footer', fields: ['newsletter', 'subscribe', 'rights'] },
];

export function SiteContentEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [tab, setTab] = useState<Tab>('brand');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings);
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <div className="p-8">Loading...</div>;

  const setMsg = (section: string, field: string, locale: 'en' | 'ar', value: string) => {
    setSettings((s) =>
      s
        ? {
            ...s,
            messages: {
              ...s.messages,
              [locale]: {
                ...s.messages[locale],
                [section]: { ...s.messages[locale][section], [field]: value },
              },
            },
          }
        : s
    );
  };

  const updateCollection = (index: number, patch: Partial<CollectionItem>) => {
    setSettings((s) => {
      if (!s) return s;
      const collections = [...s.collections];
      collections[index] = { ...collections[index], ...patch };
      return { ...s, collections };
    });
  };

  const updateGallery = (index: number, patch: Partial<GalleryItem>) => {
    setSettings((s) => {
      if (!s) return s;
      const gallery = [...s.gallery];
      gallery[index] = { ...gallery[index], ...patch };
      return { ...s, gallery };
    });
  };

  const updateMoodboard = (index: number, patch: Partial<MoodBoard>) => {
    setSettings((s) => {
      if (!s) return s;
      const moodboards = [...s.inspiration.moodboards];
      moodboards[index] = { ...moodboards[index], ...patch };
      return { ...s, inspiration: { ...s.inspiration, moodboards } };
    });
  };

  const updateCategory = (index: number, patch: Partial<CategoryItem>) => {
    setSettings((s) => {
      if (!s) return s;
      const categories = [...s.categories];
      categories[index] = { ...categories[index], ...patch };
      return { ...s, categories };
    });
  };

  const removeAt = <T,>(arr: T[], index: number) => arr.filter((_, i) => i !== index);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-navy">Site Content</h1>
          <p className="text-charcoal/60 mt-1">Edit all images, text, and branding across the website</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-6 py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
      {saved && <p className="mt-2 text-green-700 text-sm">Saved successfully! Refresh the website to see changes.</p>}

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-navy text-cream' : 'bg-white text-navy hover:bg-beige'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="mt-6 space-y-6 max-w-4xl">
        {tab === 'brand' && (
          <Card title="Brand & Logo">
            <ImageField
              label="Logo Image"
              value={settings.brand.logo}
              onChange={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, logo: v } })}
              hint="Leave empty to use text logo. Upload PNG/SVG with transparent background."
            />
            <Bilingual
              label="Brand Name"
              en={settings.brand.name_en}
              ar={settings.brand.name_ar}
              onEn={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, name_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, name_ar: v } })}
            />
            <Bilingual
              label="Tagline"
              en={settings.brand.tagline_en}
              ar={settings.brand.tagline_ar}
              onEn={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, tagline_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, tagline_ar: v } })}
              multiline
            />
            <Bilingual
              label="Location"
              en={settings.brand.location_en}
              ar={settings.brand.location_ar}
              onEn={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, location_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, brand: { ...s.brand, location_ar: v } })}
            />
          </Card>
        )}

        {tab === 'hero' && (
          <Card title="Homepage Hero">
            <ImageField
              label="Hero Background Image"
              value={settings.hero.image}
              onChange={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, image: v } })}
            />
            <Bilingual
              label="Image Alt Text"
              en={settings.hero.imageAlt_en}
              ar={settings.hero.imageAlt_ar}
              onEn={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, imageAlt_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, imageAlt_ar: v } })}
            />
            <Bilingual
              label="Title"
              en={settings.hero.title_en}
              ar={settings.hero.title_ar}
              onEn={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, title_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, title_ar: v } })}
            />
            <Bilingual
              label="Subtitle"
              en={settings.hero.subtitle_en}
              ar={settings.hero.subtitle_ar}
              onEn={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, subtitle_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, subtitle_ar: v } })}
              multiline
            />
            <Bilingual
              label="Primary Button"
              en={settings.hero.cta_en}
              ar={settings.hero.cta_ar}
              onEn={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, cta_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, cta_ar: v } })}
            />
            <Bilingual
              label="Secondary Button (AR Tour)"
              en={settings.hero.secondaryCta_en}
              ar={settings.hero.secondaryCta_ar}
              onEn={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, secondaryCta_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, hero: { ...s.hero, secondaryCta_ar: v } })}
            />
          </Card>
        )}

        {tab === 'homepage' && (
          <>
            <Card title="Homepage Section Headings">
              <Bilingual label="Bestsellers Eyebrow" en={settings.homepage.bestsellersEyebrow_en} ar={settings.homepage.bestsellersEyebrow_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, bestsellersEyebrow_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, bestsellersEyebrow_ar: v } })} />
              <Bilingual label="Bestsellers Title" en={settings.homepage.bestsellersTitle_en} ar={settings.homepage.bestsellersTitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, bestsellersTitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, bestsellersTitle_ar: v } })} />
              <Bilingual label="Collections Title" en={settings.homepage.collectionsTitle_en} ar={settings.homepage.collectionsTitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, collectionsTitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, collectionsTitle_ar: v } })} />
              <Bilingual label="Collections Subtitle" en={settings.homepage.collectionsSubtitle_en} ar={settings.homepage.collectionsSubtitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, collectionsSubtitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, collectionsSubtitle_ar: v } })} multiline />
              <Bilingual label="Gallery Eyebrow" en={settings.homepage.galleryEyebrow_en} ar={settings.homepage.galleryEyebrow_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, galleryEyebrow_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, galleryEyebrow_ar: v } })} />
              <Bilingual label="Gallery Title" en={settings.homepage.galleryTitle_en} ar={settings.homepage.galleryTitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, galleryTitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, galleryTitle_ar: v } })} />
              <Bilingual label="Gallery Subtitle" en={settings.homepage.gallerySubtitle_en} ar={settings.homepage.gallerySubtitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, gallerySubtitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, gallerySubtitle_ar: v } })} multiline />
              <Bilingual label="Products Count Label" en={settings.homepage.productsLabel_en} ar={settings.homepage.productsLabel_ar}
                onEn={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, productsLabel_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, homepage: { ...s.homepage, productsLabel_ar: v } })} />
            </Card>
            <Card title="Bento Gallery Images">
              {settings.gallery.map((item, i) => (
                <div key={item.id} className="p-4 border border-beige-dark/40 rounded-xl space-y-3">
                  <ItemHeader
                    title={item.title_en || `Gallery item ${i + 1}`}
                    onRemove={() => setSettings((s) => s && { ...s, gallery: removeAt(s.gallery, i) })}
                  />
                  <ImageField label="Image" value={item.image} onChange={(v) => updateGallery(i, { image: v })} />
                  <Bilingual label="Room Title" en={item.title_en} ar={item.title_ar}
                    onEn={(v) => updateGallery(i, { title_en: v })} onAr={(v) => updateGallery(i, { title_ar: v })} />
                  <Field label="Grid Size" value={item.span} onChange={(v) => updateGallery(i, { span: v })}
                    hint="e.g. col-span-1, col-span-2 row-span-2" />
                </div>
              ))}
              <AddButton
                label="Add Gallery Image"
                onClick={() => setSettings((s) => s && {
                  ...s,
                  gallery: [...s.gallery, {
                    id: newId('gallery'),
                    image: '',
                    title_en: 'New Room',
                    title_ar: 'غرفة جديدة',
                    span: 'col-span-1',
                  }],
                })}
              />
            </Card>
          </>
        )}

        {tab === 'collections' && (
          <>
          <Card title="Shop Categories">
            {settings.categories.map((cat, i) => (
              <div key={`${cat.id}-${i}`} className="p-3 border border-beige-dark/30 rounded-xl space-y-3">
                <ItemHeader
                  title={cat.name_en || `Category ${i + 1}`}
                  onRemove={() => setSettings((s) => s && { ...s, categories: removeAt(s.categories, i) })}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="ID" value={cat.id} onChange={(v) => updateCategory(i, { id: v })} />
                  <Field label="Name EN" value={cat.name_en} onChange={(v) => updateCategory(i, { name_en: v })} />
                  <Field label="Name AR" value={cat.name_ar} onChange={(v) => updateCategory(i, { name_ar: v })} />
                </div>
              </div>
            ))}
            <AddButton
              label="Add Category"
              onClick={() => setSettings((s) => s && {
                ...s,
                categories: [...s.categories, { id: newId('category'), name_en: 'New Category', name_ar: 'فئة جديدة' }],
              })}
            />
          </Card>
          <Card title="Collections">
            {settings.collections.map((col, i) => (
              <div key={`${col.id}-${i}`} className="p-4 border border-beige-dark/40 rounded-xl space-y-3">
                <ItemHeader
                  title={col.name_en || `Collection ${i + 1}`}
                  onRemove={() => setSettings((s) => s && { ...s, collections: removeAt(s.collections, i) })}
                />
                <Field label="Collection ID" value={col.id} onChange={(v) => updateCollection(i, { id: v })} />
                <ImageField label="Cover Image" value={col.image} onChange={(v) => updateCollection(i, { image: v })} />
                <Bilingual label="Name" en={col.name_en} ar={col.name_ar}
                  onEn={(v) => updateCollection(i, { name_en: v })} onAr={(v) => updateCollection(i, { name_ar: v })} />
                <Bilingual label="Description" en={col.desc_en} ar={col.desc_ar}
                  onEn={(v) => updateCollection(i, { desc_en: v })} onAr={(v) => updateCollection(i, { desc_ar: v })} multiline />
              </div>
            ))}
            <AddButton
              label="Add Collection"
              onClick={() => setSettings((s) => s && {
                ...s,
                collections: [...s.collections, {
                  id: newId('collection'),
                  name_en: 'New Collection',
                  name_ar: 'مجموعة جديدة',
                  desc_en: 'Description in English',
                  desc_ar: 'الوصف بالعربية',
                  image: '',
                  productCount: 0,
                }],
              })}
            />
          </Card>
          </>
        )}

        {tab === 'inspiration' && (
          <>
            <Card title="Inspiration Page Hero">
              <ImageField label="Hero Image" value={settings.inspiration.heroImage}
                onChange={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, heroImage: v } })} />
              <Bilingual label="Page Title" en={settings.inspiration.heroTitle_en} ar={settings.inspiration.heroTitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, heroTitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, heroTitle_ar: v } })} />
              <Bilingual label="Subtitle" en={settings.inspiration.heroSubtitle_en} ar={settings.inspiration.heroSubtitle_ar}
                onEn={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, heroSubtitle_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, heroSubtitle_ar: v } })} />
            </Card>
            <Card title="Mood Boards">
              <Bilingual label="Section Heading" en={settings.inspiration.moodboardsHeading_en} ar={settings.inspiration.moodboardsHeading_ar}
                onEn={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, moodboardsHeading_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, inspiration: { ...s.inspiration, moodboardsHeading_ar: v } })} />
              {settings.inspiration.moodboards.map((board, i) => (
                <div key={board.id} className="p-4 border border-beige-dark/40 rounded-xl space-y-3">
                  <ItemHeader
                    title={board.title_en || `Mood board ${i + 1}`}
                    onRemove={() => setSettings((s) => s && {
                      ...s,
                      inspiration: { ...s.inspiration, moodboards: removeAt(s.inspiration.moodboards, i) },
                    })}
                  />
                  <ImageField label="Mood Board Image" value={board.image} onChange={(v) => updateMoodboard(i, { image: v })} />
                  <Bilingual label="Title" en={board.title_en} ar={board.title_ar}
                    onEn={(v) => updateMoodboard(i, { title_en: v })} onAr={(v) => updateMoodboard(i, { title_ar: v })} />
                  <Bilingual label="Tags (comma-separated)" en={board.tags_en} ar={board.tags_ar}
                    onEn={(v) => updateMoodboard(i, { tags_en: v })} onAr={(v) => updateMoodboard(i, { tags_ar: v })} />
                </div>
              ))}
              <AddButton
                label="Add Mood Board"
                onClick={() => setSettings((s) => s && {
                  ...s,
                  inspiration: {
                    ...s.inspiration,
                    moodboards: [...s.inspiration.moodboards, {
                      id: newId('moodboard'),
                      title_en: 'New Mood Board',
                      title_ar: 'لوحة إلهام جديدة',
                      image: '',
                      tags_en: 'Tag 1, Tag 2',
                      tags_ar: 'وسم ١، وسم ٢',
                    }],
                  },
                })}
              />
            </Card>
          </>
        )}

        {tab === 'footer' && (
          <>
            <Card title="Footer Links">
              <Bilingual label="Shop Column Heading" en={settings.footer.shopHeading_en} ar={settings.footer.shopHeading_ar}
                onEn={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, shopHeading_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, shopHeading_ar: v } })} />
              <Bilingual label="All Products Link" en={settings.footer.allProducts_en} ar={settings.footer.allProducts_ar}
                onEn={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, allProducts_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, allProducts_ar: v } })} />
              <Bilingual label="Collections Link" en={settings.footer.collectionsLink_en} ar={settings.footer.collectionsLink_ar}
                onEn={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, collectionsLink_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, collectionsLink_ar: v } })} />
              <Bilingual label="Inspiration Link" en={settings.footer.inspirationLink_en} ar={settings.footer.inspirationLink_ar}
                onEn={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, inspirationLink_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, inspirationLink_ar: v } })} />
              <Bilingual label="Email Placeholder" en={settings.footer.emailPlaceholder_en} ar={settings.footer.emailPlaceholder_ar}
                onEn={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, emailPlaceholder_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, footer: { ...s.footer, emailPlaceholder_ar: v } })} />
            </Card>
            <Card title="Contact">
              <Field label="Phone" value={settings.contact.phone} onChange={(v) => setSettings((s) => s && { ...s, contact: { ...s.contact, phone: v } })} />
              <Field label="Email" value={settings.contact.email} onChange={(v) => setSettings((s) => s && { ...s, contact: { ...s.contact, email: v } })} />
              <Field label="WhatsApp" value={settings.contact.whatsapp} onChange={(v) => setSettings((s) => s && { ...s, contact: { ...s.contact, whatsapp: v } })} />
            </Card>
            <Card title="Social Media Links">
              <Field label="Instagram URL" value={settings.social.instagram} onChange={(v) => setSettings((s) => s && { ...s, social: { ...s.social, instagram: v } })} />
              <Field label="X (Twitter) URL" value={settings.social.twitter} onChange={(v) => setSettings((s) => s && { ...s, social: { ...s.social, twitter: v } })} />
              <Field label="Snapchat URL" value={settings.social.snapchat} onChange={(v) => setSettings((s) => s && { ...s, social: { ...s.social, snapchat: v } })} />
              <Field label="Pinterest URL" value={settings.social.pinterest} onChange={(v) => setSettings((s) => s && { ...s, social: { ...s.social, pinterest: v } })} />
            </Card>
          </>
        )}

        {tab === 'text' && (
          <Card title="All Site Text (English & Arabic)">
            <p className="text-sm text-charcoal/60 mb-4">These control navigation, shop, cart, checkout, account, AI assistant, trust badges, and footer text.</p>
            {MESSAGE_SECTIONS.map((section) => (
              <div key={section.key} className="space-y-3 pb-6 mb-6 border-b border-beige-dark/30 last:border-0">
                <h3 className="font-display text-lg text-navy">{section.label}</h3>
                {section.fields.map((field) => (
                  <Bilingual
                    key={field}
                    label={field}
                    en={settings.messages.en[section.key]?.[field] ?? ''}
                    ar={settings.messages.ar[section.key]?.[field] ?? ''}
                    onEn={(v) => setMsg(section.key, field, 'en', v)}
                    onAr={(v) => setMsg(section.key, field, 'ar', v)}
                    multiline={field === 'greeting' || field === 'placeholder'}
                  />
                ))}
              </div>
            ))}
          </Card>
        )}

        {tab === 'seo' && (
          <Card title="SEO & Social Sharing">
            <ImageField label="Social Share Image (Open Graph)" value={settings.seo.ogImage}
              onChange={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, ogImage: v } })} />
            <Bilingual label="Page Title" en={settings.seo.title_en} ar={settings.seo.title_ar}
              onEn={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, title_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, title_ar: v } })} />
            <Bilingual label="Meta Description" en={settings.seo.description_en} ar={settings.seo.description_ar}
              onEn={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, description_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, description_ar: v } })} multiline />
            <Bilingual label="Keywords" en={settings.seo.keywords_en} ar={settings.seo.keywords_ar}
              onEn={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, keywords_en: v } })}
              onAr={(v) => setSettings((s) => s && { ...s, seo: { ...s.seo, keywords_ar: v } })} />
          </Card>
        )}

        {tab === 'theme' && (
          <>
            <Card title="Brand Colors">
              <div className="grid grid-cols-3 gap-4">
                <ColorInput label="Navy" value={settings.theme.navy} onChange={(v) => setSettings((s) => s && { ...s, theme: { ...s.theme, navy: v } })} />
                <ColorInput label="Gold" value={settings.theme.gold} onChange={(v) => setSettings((s) => s && { ...s, theme: { ...s.theme, gold: v } })} />
                <ColorInput label="Beige" value={settings.theme.beige} onChange={(v) => setSettings((s) => s && { ...s, theme: { ...s.theme, beige: v } })} />
              </div>
            </Card>
            <Card title="Announcement Bar">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={settings.announcement.enabled}
                  onChange={(e) => setSettings((s) => s && { ...s, announcement: { ...s.announcement, enabled: e.target.checked } })}
                  className="accent-gold" />
                <span className="text-sm">Show announcement bar</span>
              </label>
              <Bilingual label="Announcement Text" en={settings.announcement.text_en} ar={settings.announcement.text_ar}
                onEn={(v) => setSettings((s) => s && { ...s, announcement: { ...s.announcement, text_en: v } })}
                onAr={(v) => setSettings((s) => s && { ...s, announcement: { ...s.announcement, text_ar: v } })} />
            </Card>
          </>
        )}

        <button type="submit" disabled={saving} className="px-8 py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-display text-xl text-navy">{title}</h2>
      {children}
    </section>
  );
}

function Bilingual({
  label, en, ar, onEn, onAr, multiline,
}: {
  label: string; en: string; ar: string;
  onEn: (v: string) => void; onAr: (v: string) => void; multiline?: boolean;
}) {
  const cls = 'w-full mt-1 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none text-sm';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-navy">{label} (EN)</label>
        {multiline ? (
          <textarea value={en} onChange={(e) => onEn(e.target.value)} rows={2} className={cls} />
        ) : (
          <input value={en} onChange={(e) => onEn(e.target.value)} className={cls} />
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-navy">{label} (AR)</label>
        {multiline ? (
          <textarea value={ar} onChange={(e) => onAr(e.target.value)} rows={2} dir="rtl" className={cls} />
        ) : (
          <input value={ar} onChange={(e) => onAr(e.target.value)} dir="rtl" className={cls} />
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none text-sm" />
      {hint && <p className="text-xs text-charcoal/50 mt-1">{hint}</p>}
    </div>
  );
}

function ItemHeader({ title, onRemove }: { title: string; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-medium text-navy text-sm">{title}</p>
      <button
        type="button"
        onClick={() => { if (confirm('Remove this item?')) onRemove(); }}
        className="flex items-center gap-1 px-2 py-1 text-xs text-terracotta hover:bg-terracotta/10 rounded-lg"
      >
        <Trash2 className="h-3.5 w-3.5" /> Remove
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-beige-dark/50 rounded-xl text-sm font-medium text-navy hover:border-gold hover:text-gold transition-colors"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <div className="flex gap-2 mt-1">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-beige-dark font-mono text-sm" />
      </div>
    </div>
  );
}