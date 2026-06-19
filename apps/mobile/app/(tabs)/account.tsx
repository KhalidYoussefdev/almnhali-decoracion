import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Logo } from '@/components/Logo';
import { t } from '@/i18n';
import { useWishlistStore } from '@/stores/wishlist';

const menuItems = [
  { icon: 'cube-outline' as const, labelKey: 'savedRooms', route: '/account/rooms' },
  { icon: 'heart-outline' as const, labelKey: 'wishlist', route: '/account/wishlist' },
  { icon: 'location-outline' as const, labelKey: 'orderTracking', route: '/account/orders' },
];

export default function AccountScreen() {
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const biometricLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Biometric login not available on this device');
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t('biometricLogin'),
    });
    if (result.success) Alert.alert('Welcome back!', 'Signed in securely with biometrics.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          <Text style={styles.name}>Ahmed Al-Rashid</Text>
          <Text style={styles.email}>ahmed@example.com</Text>
        </View>
      </View>

      <Pressable style={styles.biometricBtn} onPress={biometricLogin}>
        <Ionicons name="finger-print" size={24} color={colors.gold.DEFAULT} />
        <Text style={styles.biometricText}>{t('biometricLogin')}</Text>
      </Pressable>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable key={item.labelKey} style={styles.menuItem}>
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
      </View>

      <View style={styles.footer}>
        <Logo compact />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
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
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: spacing.xl },
});