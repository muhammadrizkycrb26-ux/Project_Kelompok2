import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import type { ColorValue } from 'react-native';
import { useDarkMode } from '@/data/theme-store';

const COLORS = {
  muted: '#8C8781',
  orange: '#C9824A',
  white: '#FFFFFF',
  border: '#EAE4DC',
};

export default function TabLayout() {
  const dark = useDarkMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: dark ? '#A8A29B' : COLORS.muted,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: dark ? '#211F1D' : COLORS.white,
          borderTopColor: dark ? '#37332F' : COLORS.border,
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          includeFontPadding: false,
          textAlign: 'center',
        },

        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon symbol="⌂" color={color} />,
        }}
      />

      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color }) => <TabIcon symbol="◷" color={color} />,
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabIcon symbol="◇" color={color} />,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color }) => <TabIcon symbol="▤" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <TabIcon symbol="●" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  symbol,
  color,
}: {
  symbol: string;
  color: ColorValue;
}) {
  return (
    <Text
      style={{
        fontSize: 22,
        color,
        textAlign: 'center',
      }}
    >
      {symbol}
    </Text>
  );
}