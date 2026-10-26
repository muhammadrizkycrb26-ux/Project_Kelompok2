
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import type { ColorValue } from 'react-native';
import { Palette } from '@/constants/palette';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.accent,
        tabBarInactiveTintColor: Palette.muted,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: Palette.surface,
          borderTopColor: Palette.border,
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
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="⌂" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="◷" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="◇" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="▤" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <TabIcon symbol="●" color={color} />
          ),
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
