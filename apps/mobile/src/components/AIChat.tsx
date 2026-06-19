import { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { t } from '@/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: t('aiGreeting') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: 'I recommend our Heritage Oak SPC Flooring for Riyadh homes — heat-resistant and beautiful. Want to see it in AR?',
    }]);
    setLoading(false);
  };

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
                <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={[styles.bubbleText, item.role === 'user' && styles.userText]}>{item.content}</Text>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={t('search')}
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
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold.DEFAULT, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10,37,64,0.5)' },
  panel: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.navy.DEFAULT, padding: spacing.md, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  headerTitle: { flex: 1, color: colors.cream, fontSize: 18, fontWeight: '600' },
  messages: { padding: spacing.md, minHeight: 200 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.navy.DEFAULT, borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: colors.beige.DEFAULT, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, color: colors.navy.DEFAULT },
  userText: { color: colors.cream },
  inputRow: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.beige.dark, gap: 8 },
  input: { flex: 1, backgroundColor: colors.beige.DEFAULT, borderRadius: borderRadius.xl, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn: { backgroundColor: colors.gold.DEFAULT, padding: 12, borderRadius: borderRadius.xl },
});