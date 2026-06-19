import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Button } from '@/components/Button';
import { getProductById } from '@/data/products';
import { t, getLocale } from '@/i18n';

export default function ARScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProductById(id!);
  const [permission, requestPermission] = useCameraPermissions();
  const locale = getLocale();

  if (!product) return null;

  if (!permission?.granted) {
    return (
      <View style={styles.permission}>
        <Ionicons name="camera-outline" size={64} color={colors.gold.DEFAULT} />
        <Text style={styles.permissionText}>Camera access needed for AR placement</Text>
        <Button title="Grant Permission" variant="gold" onPress={requestPermission} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          <View style={styles.placementGuide}>
            <Ionicons name="cube" size={48} color={colors.gold.DEFAULT} />
            <Text style={styles.guideText}>{t('placeInRoom')}</Text>
            <Text style={styles.productName}>{locale === 'ar' ? product.name_ar : product.name_en}</Text>
            <Text style={styles.hint}>Point camera at a flat surface, then tap to place</Text>
          </View>
          <View style={styles.controls}>
            <Button title="Save Room" variant="gold" onPress={() => {}} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy.DEFAULT },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: spacing.lg },
  placementGuide: { alignItems: 'center', marginTop: 80, backgroundColor: 'rgba(10,37,64,0.7)', padding: spacing.lg, borderRadius: borderRadius['2xl'], marginHorizontal: spacing.md },
  guideText: { color: colors.gold.DEFAULT, fontSize: 18, fontWeight: '600', marginTop: spacing.md },
  productName: { color: colors.cream, fontSize: 16, marginTop: 4 },
  hint: { color: 'rgba(250,248,245,0.6)', fontSize: 13, marginTop: 8, textAlign: 'center' },
  controls: { marginBottom: spacing.xl },
  permission: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy.DEFAULT, padding: spacing.xl },
  permissionText: { color: colors.cream, fontSize: 16, textAlign: 'center', marginTop: spacing.md },
});