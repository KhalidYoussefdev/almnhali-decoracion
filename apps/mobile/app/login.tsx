import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { t } from '@/i18n';
import { useAuthStore } from '@/stores/auth';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const err = await login(email.trim(), password);
    if (err) Alert.alert(t('error'), err);
    else router.replace('/(tabs)/account');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('signIn')}</Text>
        <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder={t('email')} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput value={password} onChangeText={setPassword} placeholder={t('password')} style={styles.input} secureTextEntry />
        <Pressable style={[styles.btn, loading && styles.btnDisabled]} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? t('signingIn') : t('signIn')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/register')}>
          <Text style={styles.link}>{t('noAccount')}</Text>
        </Pressable>
      </View>
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