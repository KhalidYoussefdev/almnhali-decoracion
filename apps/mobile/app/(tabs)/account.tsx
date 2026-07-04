import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Logo } from '@/components/Logo';
import { t } from '@/i18n';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';

const menuItems = [
  { icon: 'heart-outline' as const, labelKey: 'wishlist', route: '/wishlist' },
  { icon: 'location-outline' as const, labelKey: 'orderTracking', route: '/shop' },
  { icon: 'document-text-outline' as const, labelKey: 'privacy', route: 'https://almnhali.com/privacy' },
];

export default function AccountScreen() {
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user, hydrated, hydrate, logout } = useAuthStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  const biometricLogin = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert(t('error'), t('biometricUnavailable'));
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: t('biometricLogin') });
    if (result.success) Alert.alert(t('welcomeBack'), user.name);
  };

  if (!hydrated) {
    return <SafeAreaView style={styles.safe}><Text style={styles.loading}>...</Text></SafeAreaView>;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.guest}>
          <Text style={styles.title}>{t('account')}</Text>
          <Text style={styles.guestText}>{t('guestPrompt')}</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/login')}>
            <Text style={styles.primaryBtnText}>{t('signIn')}</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/register')}>
            <Text style={styles.secondaryBtnText}>{t('createAccount')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone ? <Text style={styles.email}>{user.phone}</Text> : null}
        </View>
      </View>

      <Pressable style={styles.biometricBtn} onPress={biometricLogin}>
        <Ionicons name="finger-print" size={24} color={colors.gold.DEFAULT} />
        <Text style={styles.biometricText}>{t('biometricLogin')}</Text>
      </Pressable>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable
            key={item.labelKey}
            style={styles.menuItem}
            onPress={() => {
              if (item.route.startsWith('http')) {
                import('expo-linking').then(({ openURL }) => openURL(item.route));
              } else {
                router.push(item.route as '/shop' | '/wishlist');
              }
            }}
          >
            <Ionicons name={item.icon} size={22} color={colors.gold.DEFAULT} />
            <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
            {item.labelKey === 'wishlist' && wishlistCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color={colors.navy[300]} style={{ marginLeft: 'auto' }} />
          </Pressable>
        ))}
        <Pressable style={styles.logoutBtn} onPress={async () => { await logout(); }}>
          <Ionicons name="log-out-outline" size={22} color={colors.terracotta.DEFAULT} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Logo compact />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  loading: { textAlign: 'center', marginTop: 40 },
  guest: { padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.navy.DEFAULT },
  guestText: { fontSize: 14, color: colors.charcoal, marginTop: 8, marginBottom: spacing.lg },
  primaryBtn: { backgroundColor: colors.gold.DEFAULT, padding: 16, borderRadius: borderRadius.xl, alignItems: 'center' },
  primaryBtnText: { fontWeight: '700', color: colors.navy.DEFAULT },
  secondaryBtn: { borderWidth: 1, borderColor: colors.gold.DEFAULT, padding: 16, borderRadius: borderRadius.xl, alignItems: 'center', marginTop: 12 },
  secondaryBtnText: { fontWeight: '600', color: colors.navy.DEFAULT },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.gold.DEFAULT, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '700', color: colors.navy.DEFAULT },
  name: { fontSize: 20, fontWeight: '600', color: colors.navy.DEFAULT },
  email: { fontSize: 14, color: colors.charcoal, marginTop: 2 },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.lg, padding: spacing.md, backgroundColor: colors.navy.DEFAULT, borderRadius: borderRadius['2xl'] },
  biometricText: { color: colors.cream, fontSize: 15, fontWeight: '500' },
  menu: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.xl, marginBottom: spacing.sm },
  menuLabel: { fontSize: 16, fontWeight: '500', color: colors.navy.DEFAULT },
  badge: { backgroundColor: colors.gold.DEFAULT, borderRadius: borderRadius.full, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.navy.DEFAULT },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, marginTop: spacing.sm },
  logoutText: { fontSize: 16, fontWeight: '500', color: colors.terracotta.DEFAULT },
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: spacing.xl },
});