
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import type { ColorValue } from 'react-native';

const COLORS = {
  background: '#F7F4EF',
  muted: '#8C8781',
  orange: '#C9824A',
  white: '#FFFFFF',
};

export default function TabLayout() {
  return (
    
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: '#EAE4DC',
        height: 68,
        paddingTop: 6,
        paddingBottom: 6,
        },

        tabBarLabelStyle: {
        fontSize: 9,
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
