import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@almnhali/design-system';
import { ProductCard } from '@/components/ProductCard';
import { useWishlistStore } from '@/stores/wishlist';
import { useProducts } from '@/hooks/useProducts';
import { t } from '@/i18n';

export default function WishlistScreen() {
  const items = useWishlistStore((s) => s.items);
  const { products } = useProducts();
  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>{t('wishlist')}</Text>
      {wishlistProducts.length === 0 ? (
        <Text style={styles.empty}>{t('wishlistEmpty')}</Text>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing.sm }}
          renderItem={({ item }) => (
            <View style={{ width: '50%' }}>
              <ProductCard product={item} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  title: { fontSize: 28, fontWeight: '700', color: colors.navy.DEFAULT, padding: spacing.md },
  empty: { textAlign: 'center', color: colors.charcoal, marginTop: 40, paddingHorizontal: spacing.lg },
});