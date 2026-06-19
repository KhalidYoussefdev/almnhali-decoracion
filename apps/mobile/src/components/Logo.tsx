import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@almnhali/design-system';
import { isRTL } from '@/i18n';

interface LogoProps {
  compact?: boolean;
  dark?: boolean;
}

export function Logo({ compact = false, dark = false }: LogoProps) {
  const textColor = dark ? colors.white : colors.navy.DEFAULT;
  const accentColor = dark ? colors.gold.light : colors.gold.dark;

  return (
    <View style={styles.container}>
      <Text style={[styles.brand, compact && styles.brandCompact, { color: textColor }]}>
        Almnhali
        <Text style={{ color: colors.gold.DEFAULT }}> Decoración</Text>
      </Text>
      {!compact && (
        <Text style={[styles.arabic, { color: accentColor }]}>المنهالي للديكور</Text>
      )}
      <LinearGradient
        colors={[colors.gold.DEFAULT, colors.gold.light, colors.gold.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.underline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: isRTL() ? 'flex-end' : 'flex-start' },
  brand: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  brandCompact: { fontSize: 20 },
  arabic: { fontSize: 11, letterSpacing: 2, marginTop: 2 },
  underline: { height: 2, width: 48, borderRadius: 2, marginTop: 4 },
});