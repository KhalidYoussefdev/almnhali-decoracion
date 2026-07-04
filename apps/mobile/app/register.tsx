import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { t } from '@/i18n';
import { useAuthStore } from '@/stores/auth';

export default function RegisterScreen() {
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const submit = async () => {
    const err = await register({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
    if (err) Alert.alert(t('error'), err);
    else router.replace('/(tabs)/account');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('createAccount')}</Text>
        <Text style={styles.subtitle}>{t('registerSubtitle')}</Text>
        {(['name', 'email', 'phone', 'password', 'confirmPassword'] as const).map((key) => (
          <TextInput
            key={key}
            value={form[key]}
            onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
            placeholder={t(key === 'name' ? 'fullName' : key === 'confirmPassword' ? 'confirmPassword' : key)}
            style={styles.input}
            secureTextEntry={key.includes('password')}
            autoCapitalize={key === 'email' ? 'none' : 'words'}
            keyboardType={key === 'email' ? 'email-address' : key === 'phone' ? 'phone-pad' : 'default'}
          />
        ))}
        <Pressable style={[styles.btn, loading && styles.btnDisabled]} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? t('creating') : t('createAccount')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>{t('alreadyHaveAccount')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.navy.DEFAULT },
  subtitle: { fontSize: 14, color: colors.charcoal, marginTop: 8, marginBottom: spacing.lg },
  input: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.beige.dark },
  btn: { backgroundColor: colors.gold.DEFAULT, padding: 16, borderRadius: borderRadius.xl, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.navy.DEFAULT, fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: colors.gold.DEFAULT, fontWeight: '600' },
});