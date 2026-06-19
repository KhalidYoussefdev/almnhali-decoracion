import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Button } from '@/components/Button';
import { useCartStore } from '@/stores/cart';
import { getProductById } from '@/data/products';
import { t, getLocale } from '@/i18n';

type Payment = 'mada' | 'apple' | 'stc' | 'tabby';

const payments: { id: Payment; label: string }[] = [
  { id: 'mada', label: 'Mada' },
  { id: 'apple', label: 'Apple Pay' },
  { id: 'stc', label: 'STC Pay' },
  { id: 'tabby', label: 'Tabby — Pay in 4' },
];

export default function CheckoutScreen() {
  const [payment, setPayment] = useState<Payment>('mada');
  const [loading, setLoading] = useState(false);
  const { items, clearCart } = useCartStore();
  const locale = getLocale();

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const total = subtotal + (subtotal >= 500 ? 0 : 49);

  const placeOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setLoading(false);
    Alert.alert('Order Placed!', 'شكراً لطلبك — Thank you for your order');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>
      <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor={colors.navy[300]} />
      <TextInput placeholder="Phone (+966)" style={styles.input} placeholderTextColor={colors.navy[300]} keyboardType="phone-pad" />
      <TextInput placeholder="Street Address" style={styles.input} placeholderTextColor={colors.navy[300]} />
      <TextInput placeholder="City (Riyadh)" style={styles.input} placeholderTextColor={colors.navy[300]} />

      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Payment</Text>
      <View style={styles.paymentGrid}>
        {payments.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setPayment(p.id)}
            style={[styles.paymentCard, payment === p.id && styles.paymentActive]}
          >
            <Text style={[styles.paymentLabel, payment === p.id && styles.paymentLabelActive]}>{p.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{total} {locale === 'ar' ? 'ر.س' : 'SAR'}</Text>
      </View>

      <Button title={t('checkout')} variant="gold" onPress={placeOrder} loading={loading} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.navy.DEFAULT, marginBottom: spacing.md },
  input: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.sm, fontSize: 15, color: colors.navy.DEFAULT, borderWidth: 1, borderColor: colors.beige.dark },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  paymentCard: { width: '48%', padding: spacing.md, borderRadius: borderRadius.xl, borderWidth: 2, borderColor: colors.beige.dark, alignItems: 'center' },
  paymentActive: { borderColor: colors.gold.DEFAULT, backgroundColor: colors.gold.muted },
  paymentLabel: { fontSize: 14, fontWeight: '500', color: colors.navy[400] },
  paymentLabelActive: { color: colors.navy.DEFAULT, fontWeight: '600' },
  totalBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.navy.DEFAULT, padding: spacing.lg, borderRadius: borderRadius['2xl'], marginTop: spacing.lg },
  totalLabel: { fontSize: 20, color: colors.cream, fontWeight: '600' },
  totalValue: { fontSize: 24, color: colors.gold.DEFAULT, fontWeight: '700' },
});