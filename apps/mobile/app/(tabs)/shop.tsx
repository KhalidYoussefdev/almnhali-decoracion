import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { t, getLocale } from '@/i18n';

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  all: { en: 'All', ar: 'الكل' },
  chipboard: { en: 'Chipboard', ar: 'بديل الشيبورد' },
  'wall-panels': { en: 'Wall Panels', ar: 'ألواح جدران' },
  flooring: { en: 'Flooring', ar: 'أرضيات' },
  'outdoor-panels': { en: 'Outdoor', ar: 'خارجي' },
  'interior-wood': { en: 'Interior Wood', ar: 'بديل الخشب' },
  'stone-alternative': { en: 'Stone', ar: 'بديل الحجر' },
  baseboards: { en: 'Baseboards', ar: 'نعلات' },
  'timber-tubes': { en: 'Timber Tubes', ar: 'أنابيب' },
  soundproofing: { en: 'Soundproofing', ar: 'عوازل' },
  'partition-columns': { en: 'Columns', ar: 'أعمدة' },
};

export default function ShopScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const locale = getLocale();
  const { products, loading } = useProducts();

  const categories = useMemo(() => {
    const ids = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(ids)];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'all') result = result.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name_en.toLowerCase().includes(q) || p.name_ar.includes(q));
    }
    return result;
  }, [products, search, category]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('shop')}</Text>
        <Text style={styles.count}>{filtered.length} {t('products')}</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color={colors.navy[300]} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('search')}
          style={styles.searchInput}
          placeholderTextColor={colors.navy[300]}
        />
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 8 }}
        renderItem={({ item }) => {
          const label = CATEGORY_LABELS[item] ?? { en: item, ar: item };
          return (
            <Pressable onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>
                {locale === 'ar' ? label.ar : label.en}
              </Text>
            </Pressable>
          );
        }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.gold.DEFAULT} />
      ) : (
        <FlatList
          data={filtered}
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
  header: { padding: spacing.md },
  title: { fontSize: 32, fontWeight: '700', color: colors.navy.DEFAULT },
  count: { fontSize: 14, color: colors.charcoal, marginTop: 4 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.xl, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.beige.dark },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 15, color: colors.navy.DEFAULT },
  categories: { marginVertical: spacing.md },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.beige.DEFAULT },
  chipActive: { backgroundColor: colors.gold.muted },
  chipText: { fontSize: 13, color: colors.navy[400] },
  chipTextActive: { fontWeight: '600', color: colors.navy.DEFAULT },
});