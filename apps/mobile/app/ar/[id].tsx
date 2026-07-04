import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '@almnhali/design-system';
import { ARPlacementViewer } from '@/components/ARPlacementViewer';
import { useProduct } from '@/hooks/useProduct';
import { supportsAR } from '@/lib/ar-intelligence';
import { getLocale, t } from '@/i18n';

function normalizeId(raw: string | string[] | undefined): string | undefined {
  if (!raw) return undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

export default function ARScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = normalizeId(params.id);
  const { product, loading } = useProduct(id);
  const locale = getLocale();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.gold.DEFAULT} />
        <Text style={styles.loadingText}>{t('arLoading')}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{locale === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</Text>
      </View>
    );
  }

  if (!supportsAR(product)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('arNotAvailable')}</Text>
      </View>
    );
  }

  return <ARPlacementViewer product={product} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy.DEFAULT,
    padding: spacing.xl,
  },
  loadingText: { color: colors.cream, marginTop: spacing.md, fontSize: 14 },
  errorText: { color: colors.cream, fontSize: 16, textAlign: 'center' },
});