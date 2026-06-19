'use client';

import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/types/product';

export default function AdminAppearancePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
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

  const setHero = (key: keyof SiteSettings['hero'], value: string) => {
    setSettings((s) => s && { ...s, hero: { ...s.hero, [key]: value } });
  };

  const setTheme = (key: keyof SiteSettings['theme'], value: string) => {
    setSettings((s) => s && { ...s, theme: { ...s.theme, [key]: value } });
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl text-navy">Appearance</h1>
      <p className="text-charcoal/60 mt-1">Customize homepage hero and brand colors</p>

      <form onSubmit={save} className="mt-8 space-y-8">
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-display text-xl text-navy">Homepage Hero</h2>
          <Input label="Hero Image URL" value={settings.hero.image} onChange={(v) => setHero('image', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title (EN)" value={settings.hero.title_en} onChange={(v) => setHero('title_en', v)} />
            <Input label="Title (AR)" value={settings.hero.title_ar} onChange={(v) => setHero('title_ar', v)} dir="rtl" />
            <Input label="Subtitle (EN)" value={settings.hero.subtitle_en} onChange={(v) => setHero('subtitle_en', v)} />
            <Input label="Subtitle (AR)" value={settings.hero.subtitle_ar} onChange={(v) => setHero('subtitle_ar', v)} dir="rtl" />
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-display text-xl text-navy">Brand Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <ColorInput label="Navy" value={settings.theme.navy} onChange={(v) => setTheme('navy', v)} />
            <ColorInput label="Gold" value={settings.theme.gold} onChange={(v) => setTheme('gold', v)} />
            <ColorInput label="Beige" value={settings.theme.beige} onChange={(v) => setTheme('beige', v)} />
          </div>
          <p className="text-xs text-charcoal/50">Color changes apply to CSS variables on next page load.</p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-display text-xl text-navy">Announcement Bar</h2>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.announcement.enabled}
              onChange={(e) => setSettings((s) => s && { ...s, announcement: { ...s.announcement, enabled: e.target.checked } })}
              className="accent-gold"
            />
            <span className="text-sm">Show announcement bar</span>
          </label>
          <Input label="Text (EN)" value={settings.announcement.text_en} onChange={(v) => setSettings((s) => s && { ...s, announcement: { ...s.announcement, text_en: v } })} />
          <Input label="Text (AR)" value={settings.announcement.text_ar} onChange={(v) => setSettings((s) => s && { ...s, announcement: { ...s.announcement, text_ar: v } })} dir="rtl" />
        </section>

        <button type="submit" disabled={saving} className="px-8 py-3 bg-gold text-navy font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="ms-4 text-green-700 text-sm">Saved successfully!</span>}
      </form>
    </div>
  );
}

function Input({ label, value, onChange, dir }: { label: string; value: string; onChange: (v: string) => void; dir?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="w-full mt-1 px-4 py-3 rounded-xl border border-beige-dark focus:border-gold outline-none" />
    </div>
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