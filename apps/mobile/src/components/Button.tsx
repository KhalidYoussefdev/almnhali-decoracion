import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing } from '@almnhali/design-system';

type Variant = 'primary' | 'secondary' | 'outline' | 'gold';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === 'gold') {
    return (
      <Pressable onPress={handlePress} disabled={disabled || loading} style={({ pressed }) => [pressed && styles.pressed, style]}>
        <LinearGradient
          colors={[colors.gold.DEFAULT, colors.gold.light, colors.gold.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, styles.gold]}
        >
          {loading ? <ActivityIndicator color={colors.navy.DEFAULT} /> : <Text style={styles.goldText}>{title}</Text>}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantStyles: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.navy.DEFAULT },
    secondary: { backgroundColor: colors.beige.DEFAULT },
    outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.navy.DEFAULT },
    gold: {},
  };

  const textStyles: Record<Variant, TextStyle> = {
    primary: { color: colors.white },
    secondary: { color: colors.navy.DEFAULT },
    outline: { color: colors.navy.DEFAULT },
    gold: {},
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.base, variantStyles[variant], pressed && styles.pressed, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.navy.DEFAULT} />
      ) : (
        <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gold: { shadowColor: colors.gold.DEFAULT, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  goldText: { color: colors.navy.DEFAULT, fontWeight: '600', fontSize: 16 },
  text: { fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});