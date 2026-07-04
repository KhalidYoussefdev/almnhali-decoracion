'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSiteSettings } from '@/contexts/SettingsContext';
import { getAIResponse, getDefaultSuggestions, type AIAction } from '@/lib/ai-assistant';
import { whatsappUrl } from '@/lib/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: AIAction[];
}

function ActionButton({ action, locale }: { action: AIAction; locale: string }) {
  const isAr = locale === 'ar';

  if (action.type === 'link' && action.href) {
    return (
      <Link
        href={action.href}
        className="text-xs px-3 py-1.5 rounded-full bg-gold/20 text-navy dark:text-cream font-medium hover:bg-gold/30"
      >
        {action.label}
      </Link>
    );
  }

  if (action.type === 'whatsapp' && action.value) {
    return (
      <a
        href={whatsappUrl(action.value, isAr ? 'مرحباً، أحتاج مساعدة' : 'Hello, I need help')}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-full bg-gold/20 text-navy dark:text-cream font-medium hover:bg-gold/30"
      >
        {action.label}
      </a>
    );
  }

  if (action.type === 'phone' && action.value) {
    return (
      <a
        href={`tel:${action.value}`}
        className="text-xs px-3 py-1.5 rounded-full bg-gold/20 text-navy dark:text-cream font-medium hover:bg-gold/30"
        dir="ltr"
      >
        {action.label}
      </a>
    );
  }

  if (action.type === 'email' && action.value) {
    return (
      <a
        href={`mailto:${action.value}`}
        className="text-xs px-3 py-1.5 rounded-full bg-gold/20 text-navy dark:text-cream font-medium hover:bg-gold/30"
        dir="ltr"
      >
        {action.label}
      </a>
    );
  }

  return null;
}

export function AIAssistant() {
  const t = useTranslations('ai');
  const locale = useLocale() as 'en' | 'ar';
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const contact = useMemo(
    () => ({
      phone: settings.contact.phone,
      whatsapp: settings.contact.whatsapp,
      email: settings.contact.email,
      location_en: settings.brand.location_en,
      location_ar: settings.brand.location_ar,
    }),
    [settings],
  );

  const suggestions = useMemo(() => getDefaultSuggestions(locale), [locale]);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('greeting') }]);
  }, [locale, t]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));
    const reply = getAIResponse(text, locale, contact);

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: reply.message, actions: reply.actions },
    ]);
    setLoading(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 end-6 z-toast p-4 bg-gold-gradient text-navy rounded-full shadow-xl hover:shadow-2xl"
        aria-label={t('title')}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 end-6 z-toast w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-beige-dark/30 overflow-hidden flex flex-col max-h-[500px]"
          >
            <div className="flex items-center justify-between p-4 bg-navy text-cream">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="font-display">{t('title')}</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-navy text-cream rounded-ee-sm'
                        : 'bg-beige dark:bg-navy-700 text-navy dark:text-cream rounded-es-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                      {msg.actions.map((action, j) => (
                        <ActionButton key={j} action={action} locale={locale} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, delay: i * 0.15 }}
                      className="w-2 h-2 bg-gold rounded-full"
                    />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gold/30 text-navy dark:text-cream hover:bg-gold/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="p-4 border-t border-beige-dark/30 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 px-4 py-2 rounded-xl bg-beige/50 dark:bg-navy-700 border-0 outline-none text-sm text-navy dark:text-cream"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2 bg-gold text-navy rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}