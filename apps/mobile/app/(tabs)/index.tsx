import { ScrollView, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { AIChat } from '@/components/AIChat';
import { products } from '@/data/products';
import { t, getLocale, setLocale, isRTL } from '@/i18n';

export default function HomeScreen() {
  const featured = products.filter((p) => p.badge);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Logo compact />
          <Pressable onPress={() => setLocale(getLocale() === 'en' ? 'ar' : 'en')} style={styles.langBtn}>
            <Text style={styles.langText}>{getLocale() === 'en' ? 'عربي' : 'EN'}</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80' }}
            style={styles.heroImage}
          />
          <LinearGradient colors={['transparent', 'rgba(10,37,64,0.85)']} style={styles.heroOverlay}>
            <View style={[styles.heroContent, isRTL() && styles.rtl]}>
              <View style={styles.goldLine} />
              <Text style={styles.heroTitle}>{t('heroTitle')}</Text>
              <Text style={styles.heroSubtitle}>{t('heroSubtitle')}</Text>
              <Button title={t('exploreCollections')} variant="gold" onPress={() => router.push('/shop')} style={{ marginTop: spacing.lg, alignSelf: 'flex-start' }} />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('featured')}</Text>
          <Text style={styles.sectionTitle}>{t('bestsellers')}</Text>
          <View style={styles.productGrid}>
            {featured.map((product) => (
              <View key={product.id} style={styles.productCol}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.trustRow}>
          {[
            { icon: 'car-outline' as const, label: t('delivery') },
            { icon: 'shield-checkmark-outline' as const, label: 'Premium Quality' },
            { icon: 'refresh-outline' as const, label: '30-Day Returns' },
          ].map((item) => (
            <View key={item.label} style={styles.trustItem}>
              <Text style={styles.trustIcon}>✦</Text>
              <Text style={styles.trustLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <AIChat />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  langBtn: { borderWidth: 1, borderColor: colors.gold.DEFAULT, borderRadius: borderRadius.md, paddingHorizontal: 10, paddingVertical: 4 },
  langText: { fontSize: 12, fontWeight: '600', color: colors.navy.DEFAULT },
  hero: { height: 420, marginHorizontal: spacing.md, borderRadius: borderRadius['2xl'], overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  heroContent: { padding: spacing.lg },
  rtl: { alignItems: 'flex-end' },
  goldLine: { width: 48, height: 3, backgroundColor: colors.gold.DEFAULT, borderRadius: 2, marginBottom: spacing.md },
  heroTitle: { fontSize: 32, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 16, color: 'rgba(250,248,245,0.9)', marginTop: 8, maxWidth: 280 },
  section: { padding: spacing.md, marginTop: spacing.lg },
  sectionLabel: { fontSize: 12, color: colors.gold.DEFAULT, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 28, fontWeight: '700', color: colors.navy.DEFAULT, marginTop: 4, marginBottom: spacing.md },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.sm },
  productCol: { width: '50%' },
  trustRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.beige.DEFAULT, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius['2xl'] },
  trustItem: { alignItems: 'center', flex: 1 },
  trustIcon: { fontSize: 20, color: colors.gold.DEFAULT },
  trustLabel: { fontSize: 11, color: colors.navy.DEFAULT, textAlign: 'center', marginTop: 4 },
});