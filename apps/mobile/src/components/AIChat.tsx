import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { t, getLocale } from '@/i18n';
import { getAIResponse, getDefaultSuggestions, type AIAction } from '@/lib/ai-assistant';
import { fetchSettings } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: AIAction[];
}

export function AIChat() {
  const locale = getLocale();
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: t('aiGreeting') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState({
    phone: '+966558466791',
    whatsapp: '+966558466791',
    email: 'hello@almnhali.com',
    location_en: 'Dammam, Eastern Province, Saudi Arabia',
    location_ar: 'الدمام، المنطقة الشرقية، المملكة العربية السعودية',
  });

  useEffect(() => {
    fetchSettings().then((s) => {
      if (s) {
        setContact({
          phone: s.contact.phone,
          whatsapp: s.contact.whatsapp,
          email: s.contact.email,
          location_en: s.brand.location_en,
          location_ar: s.brand.location_ar,
        });
      }
    });
  }, []);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('aiGreeting') }]);
  }, [locale]);

  const handleAction = (action: AIAction) => {
    if (action.type === 'shop') {
      setVisible(false);
      router.push('/shop');
      return;
    }
    if (action.type === 'whatsapp' && action.value) {
      Linking.openURL(`https://wa.me/${action.value.replace(/\D/g, '')}`);
      return;
    }
    if (action.type === 'phone' && action.value) {
      Linking.openURL(`tel:${action.value}`);
      return;
    }
    if (action.type === 'email' && action.value) {
      Linking.openURL(`mailto:${action.value}`);
    }
  };

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const reply = getAIResponse(text, locale, contact);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply.message, actions: reply.actions }]);
    setLoading(false);
  };

  const suggestions = getDefaultSuggestions(locale);

  return (
    <>
      <Pressable style={styles.fab} onPress={() => setVisible(true)}>
        <Ionicons name="chatbubble-ellipses" size={24} color={colors.navy.DEFAULT} />
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <View style={styles.header}>
              <Ionicons name="sparkles" size={20} color={colors.gold.DEFAULT} />
              <Text style={styles.headerTitle}>{t('aiAssistant')}</Text>
              <Pressable onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={colors.cream} />
              </Pressable>
            </View>

            <FlatList
              data={messages}
              keyExtractor={(_, i) => String(i)}
              style={styles.messages}
              renderItem={({ item }) => (
                <View>
                  <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                    <Text style={[styles.bubbleText, item.role === 'user' && styles.userText]}>{item.content}</Text>
                  </View>
                  {item.actions?.map((action, j) => (
                    <Pressable key={j} style={styles.actionBtn} onPress={() => handleAction(action)}>
                      <Text style={styles.actionText}>{action.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />

            {messages.length <= 1 && (
              <View style={styles.suggestions}>
                {suggestions.map((s) => (
                  <Pressable key={s} style={styles.suggestionChip} onPress={() => send(s)}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={t('aiPlaceholder')}
                style={styles.input}
                placeholderTextColor={colors.navy[300]}
              />
              <Pressable style={styles.sendBtn} onPress={() => send(input)} disabled={loading}>
                <Ionicons name="send" size={20} color={colors.navy.DEFAULT} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', bottom: 90, right: 20, width: 56, height: 56,
    borderRadius: 28, backgroundColor: colors.gold.DEFAULT,
    alignItems: 'center', justifyContent: 'center', elevation: 8,
  },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10,37,64,0.5)' },
  panel: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.navy.DEFAULT, padding: spacing.md, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  headerTitle: { flex: 1, color: colors.cream, fontSize: 18, fontWeight: '600' },
  messages: { padding: spacing.md, minHeight: 220 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.navy.DEFAULT, borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: colors.beige.DEFAULT, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, color: colors.navy.DEFAULT },
  userText: { color: colors.cream },
  actionBtn: { alignSelf: 'flex-start', backgroundColor: colors.gold.muted, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.full, marginBottom: 6, marginLeft: 4 },
  actionText: { fontSize: 12, fontWeight: '600', color: colors.navy.DEFAULT },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  suggestionChip: { borderWidth: 1, borderColor: colors.gold.DEFAULT, borderRadius: borderRadius.full, paddingHorizontal: 12, paddingVertical: 6 },
  suggestionText: { fontSize: 12, color: colors.navy.DEFAULT },
  inputRow: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.beige.dark, gap: 8 },
  input: { flex: 1, backgroundColor: colors.beige.DEFAULT, borderRadius: borderRadius.xl, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn: { backgroundColor: colors.gold.DEFAULT, padding: 12, borderRadius: borderRadius.xl },
});