import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { type Product } from '@/data/products';
import { getLocale, t } from '@/i18n';
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = getLocale();
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const badge = locale === 'ar' ? product.badge_ar ?? product.badge : product.badge;

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/product/${product.id}`)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Pressable style={styles.wishlistBtn} onPress={() => toggle(product.id)}>
          <Ionicons name={has(product.id) ? 'heart' : 'heart-outline'} size={20} color={has(product.id) ? colors.terracotta.DEFAULT : colors.navy.DEFAULT} />
        </Pressable>
        {product.arModelUrl && (
          <Pressable style={styles.arBtn} onPress={() => router.push(`/ar/${product.id}`)}>
            <Ionicons name="cube-outline" size={18} color={colors.navy.DEFAULT} />
          </Pressable>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{locale === 'ar' ? product.category_ar : product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{product.price} {locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={colors.gold.DEFAULT} />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>
        <Pressable style={styles.addBtn} onPress={() => addItem(product.id)}>
          <Ionicons name="bag-add-outline" size={16} color={colors.navy.DEFAULT} />
          <Text style={styles.addText}>{t('addToCart')}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: spacing.sm },
  imageContainer: { aspectRatio: 4 / 5, borderRadius: borderRadius['2xl'], overflow: 'hidden', backgroundColor: colors.beige.DEFAULT },
  image: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 12, left: 12, backgroundColor: colors.gold.DEFAULT, paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.navy.DEFAULT },
  wishlistBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: borderRadius.full },
  arBtn: { position: 'absolute', top: 52, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: borderRadius.full },
  info: { marginTop: spacing.md },
  category: { fontSize: 11, color: colors.gold.DEFAULT, textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.navy.DEFAULT, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 15, fontWeight: '600', color: colors.navy.DEFAULT },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 13, color: colors.charcoal },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, backgroundColor: colors.gold.muted, paddingVertical: 8, paddingHorizontal: 12, borderRadius: borderRadius.lg, alignSelf: 'flex-start' },
  addText: { fontSize: 13, fontWeight: '600', color: colors.navy.DEFAULT },
});