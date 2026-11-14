
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
} from '@expo-google-fonts/oswald';
import { initAuth, useCurrentUser } from '@/data/auth';
import { loadProducts, loadServices } from '@/data/catalog-store';
import { clearOrders, loadOrders } from '@/data/orders-store';

export default function RootLayout() {
  const user = useCurrentUser();

  // Sekali saat app dibuka: pulihkan sesi login + muat katalog (publik)
  useEffect(() => {
    void initAuth();
    void loadServices();
    void loadProducts();
  }, []);

  // Pesanan bergantung pada siapa yang login: muat ulang saat akun berganti,
  // kosongkan saat logout supaya data tidak bocor ke akun lain.
  const userId = user?.id;
  useEffect(() => {
    if (userId) void loadOrders();
    else clearOrders();
  }, [userId]);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
