import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { LayoutGrid, Search } from 'lucide-react-native';

import { BottomTabBar } from '@components';
import { DrawerBlurOverlay } from '@features/home/presentation/components/drawer/DrawerBlurOverlay';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';

const ICON_SIZE = 24;

export default function PrivateTabsLayout() {
  return (
    <View className="flex-1">
      <Tabs
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          animation: 'shift',
        }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Buzz Badge',
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
            tabBarIcon: ({ color }) => (
              <Search size={ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <LayoutGrid size={ICON_SIZE} color={color} />
            ),
          }}
        />
      </Tabs>
      <DrawerBlurOverlay />
    </View>
  );
}
