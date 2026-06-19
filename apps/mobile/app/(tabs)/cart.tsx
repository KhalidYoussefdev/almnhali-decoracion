import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Button } from '@/components/Button';
import { useCartStore } from '@/stores/cart';
import { getProductById } from '@/data/products';
import { t, getLocale } from '@/i18n';

export default function CartScreen() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const locale = getLocale();

  const cartItems = items.map((item) => ({ ...item, product: getProductById(item.productId) })).filter((i) => i.product);
  const subtotal = cartItems.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={64} color={colors.beige.dark} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button title={t('shop')} variant="gold" onPress={() => router.push('/shop')} style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>{t('cart')}</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.product!.images[0] }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {locale === 'ar' ? item.product!.name_ar : item.product!.name_en}
              </Text>
              <Text style={styles.itemPrice}>{item.product!.price} {locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
              <View style={styles.qtyRow}>
                <Pressable onPress={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Ionicons name="remove-circle-outline" size={24} color={colors.navy.DEFAULT} />
                </Pressable>
                <Text style={styles.qty}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Ionicons name="add-circle-outline" size={24} color={colors.navy.DEFAULT} />
                </Pressable>
                <Pressable onPress={() => removeItem(item.productId)} style={{ marginLeft: 'auto' }}>
                  <Ionicons name="trash-outline" size={20} color={colors.terracotta.DEFAULT} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        {subtotal < 500 && <Text style={styles.freeShip}>{t('freeShipping')}</Text>}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total} {locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
        </View>
        <Button title={t('checkout')} variant="gold" onPress={() => router.push('/checkout')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  title: { fontSize: 32, fontWeight: '700', color: colors.navy.DEFAULT, padding: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: colors.charcoal, marginTop: spacing.md },
  item: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: borderRadius['2xl'], padding: spacing.md, marginBottom: spacing.sm },
  itemImage: { width: 80, height: 80, borderRadius: borderRadius.lg },
  itemInfo: { flex: 1, marginLeft: spacing.md },
  itemName: { fontSize: 16, fontWeight: '600', color: colors.navy.DEFAULT },
  itemPrice: { fontSize: 15, color: colors.gold.dark, fontWeight: '600', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 12 },
  qty: { fontSize: 16, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  summary: { padding: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.beige.dark },
  freeShip: { fontSize: 12, color: colors.gold.dark, marginBottom: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  totalLabel: { fontSize: 20, fontWeight: '600', color: colors.navy.DEFAULT },
  totalValue: { fontSize: 22, fontWeight: '700', color: colors.gold.DEFAULT },
});