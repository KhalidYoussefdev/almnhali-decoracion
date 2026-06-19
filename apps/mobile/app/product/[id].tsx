import { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { getProductById, getRecommendations } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { t, getLocale } from '@/i18n';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProductById(id!);
  const locale = getLocale();
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  if (!product) return <View><Text>Product not found</Text></View>;

  const recommendations = getRecommendations(product.id);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{locale === 'ar' ? product.category_ar : product.category}</Text>
        <Text style={styles.name}>{locale === 'ar' ? product.name_ar : product.name_en}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={colors.gold.DEFAULT} />
          <Text style={styles.rating}>{product.rating} ({product.reviewCount})</Text>
        </View>
        <Text style={styles.price}>{product.price} {locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
        <Text style={styles.desc}>{locale === 'ar' ? product.desc_ar : product.desc_en}</Text>

        <View style={styles.actions}>
          <Button title={t('addToCart')} variant="gold" onPress={() => addItem(product.id)} style={{ flex: 1 }} />
          <Pressable style={styles.iconBtn} onPress={() => toggle(product.id)}>
            <Ionicons name={has(product.id) ? 'heart' : 'heart-outline'} size={24} color={has(product.id) ? colors.terracotta.DEFAULT : colors.navy.DEFAULT} />
          </Pressable>
          {product.arModelUrl && (
            <Pressable style={styles.iconBtn} onPress={() => router.push(`/ar/${product.id}`)}>
              <Ionicons name="cube" size={24} color={colors.navy.DEFAULT} />
            </Pressable>
          )}
        </View>

        <Text style={styles.sectionTitle}>{t('completeLook')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendations.map((p) => (
            <View key={p.id} style={{ width: 180 }}>
              <ProductCard product={p} />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  image: { width: '100%', aspectRatio: 1 },
  content: { padding: spacing.lg },
  category: { fontSize: 12, color: colors.gold.DEFAULT, textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 26, fontWeight: '700', color: colors.navy.DEFAULT, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  rating: { fontSize: 14, color: colors.charcoal },
  price: { fontSize: 28, fontWeight: '700', color: colors.navy.DEFAULT, marginTop: 12 },
  desc: { fontSize: 15, color: colors.charcoal, lineHeight: 22, marginTop: 12 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  iconBtn: { width: 52, height: 52, borderRadius: borderRadius.lg, borderWidth: 2, borderColor: colors.beige.dark, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: colors.navy.DEFAULT, marginTop: spacing.xl, marginBottom: spacing.md },
});