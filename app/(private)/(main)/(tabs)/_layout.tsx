import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Heart, Search } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';

import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';

const ICON_SIZE = 24;

export default function PrivateTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.5)',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={60}
            experimentalBlurMethod={
              Platform.OS === 'android' ? 'dimezisBlurView' : undefined
            }
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TheBuzz',
          tabBarIcon: ({ color }) => (
            <IntroBeeIcon
              width={ICON_SIZE}
              height={(ICON_SIZE * 14) / 16}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search-records"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Heart size={ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
}
