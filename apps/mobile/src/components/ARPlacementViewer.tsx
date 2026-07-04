import { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  PanResponder,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@almnhali/design-system';
import { Button } from '@/components/Button';
import { resolveImageUrl } from '@/lib/api';
import {
  getPlacementConfig,
  getSmartTip,
  getRoomLabel,
  type RoomType,
} from '@/lib/ar-intelligence';
import type { Product } from '@/data/products';
import { getLocale, t } from '@/i18n';
import { useCartStore } from '@/stores/cart';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const ROOMS: RoomType[] = ['living', 'bedroom', 'kitchen', 'outdoor'];

interface ARPlacementViewerProps {
  product: Product;
}

interface PlacementState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export function ARPlacementViewer({ product }: ARPlacementViewerProps) {
  const locale = getLocale();
  const addItem = useCartStore((s) => s.addItem);
  const cameraRef = useRef<CameraView>(null);
  const dragOrigin = useRef({ x: 0, y: 0 });

  const [permission, requestPermission] = useCameraPermissions();
  const [room, setRoom] = useState<RoomType>('living');
  const [placed, setPlaced] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [placement, setPlacement] = useState<PlacementState | null>(null);

  const config = useMemo(() => getPlacementConfig(product.category, room), [product.category, room]);
  const tip = useMemo(() => getSmartTip(product, room, locale), [product, room, locale]);
  const imageUri = resolveImageUrl(product.images[0] ?? '');
  const productName = locale === 'ar' ? product.name_ar : product.name_en;

  const resetPlacement = useCallback(() => {
    setPlacement(null);
    setPlaced(false);
    setShowGuide(true);
  }, []);

  const placeAt = useCallback((x: number, y: number) => {
    const clampedX = Math.max(60, Math.min(SCREEN_W - 160, x - 100));
    const clampedY = Math.max(120, Math.min(SCREEN_H - 220, y - 100));
    setPlacement({
      x: clampedX,
      y: clampedY,
      scale: config.defaultScale,
      rotation: 0,
    });
    setPlaced(true);
    setShowGuide(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
  }, [config.defaultScale]);

  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => placed,
      onMoveShouldSetPanResponder: () => placed,
      onPanResponderGrant: () => {
        if (placement) dragOrigin.current = { x: placement.x, y: placement.y };
      },
      onPanResponderMove: (_, gesture) => {
        setPlacement((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            x: Math.max(20, Math.min(SCREEN_W - 180, dragOrigin.current.x + gesture.dx)),
            y: Math.max(80, Math.min(SCREEN_H - 260, dragOrigin.current.y + gesture.dy)),
          };
        });
      },
    }),
    [placed, placement],
  );

  const handleRoomChange = (next: RoomType) => {
    setRoom(next);
    if (placed) resetPlacement();
  };

  const captureRoom = async () => {
    try {
      if (!cameraRef.current) return;
      await cameraRef.current.takePictureAsync({ quality: 0.8 });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      Alert.alert(
        locale === 'ar' ? 'تم الحفظ' : 'Saved',
        locale === 'ar'
          ? 'تم حفظ معاينة الغرفة في ألبوم الصور.'
          : 'Room preview saved to your photo gallery.',
      );
    } catch {
      Alert.alert(
        locale === 'ar' ? 'تعذر الحفظ' : 'Could not save',
        locale === 'ar' ? 'حاول مرة أخرى بعد وضع المنتج.' : 'Try again after placing the product.',
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.gold.DEFAULT} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-outline" size={64} color={colors.gold.DEFAULT} />
        <Text style={styles.permissionText}>{t('arCameraPermission')}</Text>
        <Button title={t('arGrantCamera')} variant="gold" onPress={requestPermission} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <Pressable
          style={styles.touchLayer}
          onPress={(e) => {
            if (!placed) placeAt(e.nativeEvent.locationX, e.nativeEvent.locationY);
          }}
        >
          {placed && placement && (
            <View
              {...panResponder.panHandlers}
              style={[
                styles.placedItem,
                {
                  left: placement.x,
                  top: placement.y,
                  transform: [
                    { scale: placement.scale },
                    { rotate: `${placement.rotation}deg` },
                  ],
                },
              ]}
            >
              <Image source={{ uri: imageUri }} style={styles.productImage} resizeMode="cover" />
              <View style={styles.placedBorder} />
            </View>
          )}
        </Pressable>

        <View style={styles.topBar} pointerEvents="box-none">
          <View style={styles.tipCard}>
            <Ionicons name="sparkles" size={16} color={colors.gold.DEFAULT} />
            <Text style={styles.tipText} numberOfLines={3}>{tip}</Text>
          </View>
          <RoomPicker room={room} onChange={handleRoomChange} locale={locale} />
        </View>

        {showGuide && !placed && (
          <View style={styles.guideOverlay} pointerEvents="none">
            <View style={styles.reticle}>
              <Ionicons name="scan-outline" size={48} color={colors.gold.DEFAULT} />
            </View>
            <Text style={styles.guideTitle}>{t('placeInRoom')}</Text>
            <Text style={styles.guideProduct}>{productName}</Text>
            <Text style={styles.guideHint}>{t('arTapToPlace')}</Text>
          </View>
        )}

        <View style={styles.bottomBar} pointerEvents="box-none">
          <View style={styles.toolRow}>
            <ToolButton icon="refresh-outline" label={t('arReset')} onPress={resetPlacement} />
            <ToolButton
              icon="arrow-undo-outline"
              label={t('arRotate')}
              onPress={() => {
                setPlacement((prev) => prev ? { ...prev, rotation: prev.rotation - 15 } : prev);
              }}
            />
            <ToolButton
              icon="add-outline"
              label={t('arZoomIn')}
              onPress={() => {
                setPlacement((prev) => prev ? { ...prev, scale: Math.min(2.5, prev.scale + 0.15) } : prev);
              }}
            />
            <ToolButton
              icon="remove-outline"
              label={t('arZoomOut')}
              onPress={() => {
                setPlacement((prev) => prev ? { ...prev, scale: Math.max(0.3, prev.scale - 0.15) } : prev);
              }}
            />
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
              <Text style={styles.secondaryText}>{locale === 'ar' ? 'رجوع' : 'Back'}</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={captureRoom} disabled={!placed}>
              <Ionicons name="camera" size={18} color={placed ? colors.cream : colors.navy[300]} />
              <Text style={[styles.secondaryText, !placed && styles.disabled]}>{t('arSaveRoom')}</Text>
            </Pressable>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => {
                addItem(product.id);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
                Alert.alert(locale === 'ar' ? 'أُضيف للسلة' : 'Added to cart', productName);
              }}
            >
              <Ionicons name="bag-add-outline" size={18} color={colors.navy.DEFAULT} />
              <Text style={styles.primaryText}>{t('addToCart')}</Text>
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

function RoomPicker({
  room,
  onChange,
  locale,
}: {
  room: RoomType;
  onChange: (r: RoomType) => void;
  locale: 'en' | 'ar';
}) {
  return (
    <View style={styles.roomRow}>
      {ROOMS.map((r) => (
        <Pressable
          key={r}
          onPress={() => onChange(r)}
          style={[styles.roomChip, room === r && styles.roomChipActive]}
        >
          <Text style={[styles.roomChipText, room === r && styles.roomChipTextActive]}>
            {getRoomLabel(r, locale)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ToolButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.toolBtn} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.cream} />
      <Text style={styles.toolLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy.DEFAULT },
  camera: { flex: 1 },
  touchLayer: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy.DEFAULT,
    padding: spacing.xl,
  },
  permissionText: { color: colors.cream, fontSize: 16, textAlign: 'center', marginTop: spacing.md },
  placedItem: {
    position: 'absolute',
    width: 200,
    height: 200,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  productImage: { width: '100%', height: '100%', borderRadius: borderRadius.lg },
  placedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.gold.DEFAULT,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
  },
  topBar: { position: 'absolute', top: 8, left: spacing.md, right: spacing.md, gap: 8 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(10,37,64,0.88)',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
  },
  tipText: { flex: 1, color: colors.cream, fontSize: 12, lineHeight: 17 },
  roomRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  roomChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(10,37,64,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.2)',
  },
  roomChipActive: { backgroundColor: colors.gold.muted, borderColor: colors.gold.DEFAULT },
  roomChipText: { fontSize: 11, color: 'rgba(250,248,245,0.8)', fontWeight: '500' },
  roomChipTextActive: { color: colors.navy.DEFAULT, fontWeight: '700' },
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  reticle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(201,168,76,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  guideTitle: { color: colors.gold.DEFAULT, fontSize: 20, fontWeight: '700' },
  guideProduct: { color: colors.cream, fontSize: 16, marginTop: 6, textAlign: 'center' },
  guideHint: { color: 'rgba(250,248,245,0.65)', fontSize: 14, marginTop: 10, textAlign: 'center' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: 'rgba(10,37,64,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201,168,76,0.25)',
    gap: spacing.md,
  },
  toolRow: { flexDirection: 'row', justifyContent: 'space-around' },
  toolBtn: { alignItems: 'center', gap: 4, minWidth: 64 },
  toolLabel: { fontSize: 10, color: 'rgba(250,248,245,0.75)' },
  actionRow: { flexDirection: 'row', gap: 8 },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.25)',
  },
  secondaryText: { color: colors.cream, fontSize: 13, fontWeight: '600' },
  disabled: { color: colors.navy[300] },
  primaryBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gold.DEFAULT,
  },
  primaryText: { color: colors.navy.DEFAULT, fontSize: 13, fontWeight: '700' },
});