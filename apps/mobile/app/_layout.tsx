import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@almnhali/design-system';
import { useAuthStore } from '@/stores/auth';

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Sign In' }} />
        <Stack.Screen name="register" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Register' }} />
        <Stack.Screen name="wishlist" options={{ headerShown: true, headerTitle: 'Wishlist', headerTintColor: colors.navy.DEFAULT }} />
        <Stack.Screen name="product/[id]" options={{ presentation: 'card', headerShown: true, headerTintColor: colors.navy.DEFAULT, headerTitle: '' }} />
        <Stack.Screen name="ar/[id]" options={{ presentation: 'fullScreenModal', headerShown: true, headerTitle: 'View in AR', headerTintColor: colors.gold.DEFAULT, headerStyle: { backgroundColor: colors.navy.DEFAULT }, headerTitleStyle: { color: colors.cream } }} />
        <Stack.Screen name="checkout" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Checkout' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}