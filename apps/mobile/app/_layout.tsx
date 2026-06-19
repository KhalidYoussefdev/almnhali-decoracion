import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@almnhali/design-system';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" options={{ presentation: 'card', headerShown: true, headerTintColor: colors.navy.DEFAULT, headerTitle: '' }} />
        <Stack.Screen name="ar/[id]" options={{ presentation: 'fullScreenModal', headerShown: true, headerTintColor: colors.gold.DEFAULT, headerStyle: { backgroundColor: colors.navy.DEFAULT }, headerTitleStyle: { color: colors.cream } }} />
        <Stack.Screen name="checkout" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Checkout' }} />
      </Stack>
    </>
  );
}