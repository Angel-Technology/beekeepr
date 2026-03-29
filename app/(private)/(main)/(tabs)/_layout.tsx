import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';
import { Tabs } from 'expo-router';
import { BookSearch, HeartHandshake } from 'lucide-react-native';
import { AppTabBar } from '@features/home/presentation/components/AppTabBar';

const iconSize = 22;

export default function PrivateTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TheBuzz',
          tabBarIcon: ({ color }) => (
            <IntroBeeIcon
              color={color}
              width={iconSize}
              height={iconSize}
              strokeWidth={2.2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search-records"
        options={{
          title: 'Search Records',
          tabBarIcon: ({ color }) => (
            <BookSearch color={color} size={iconSize} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <HeartHandshake color={color} size={iconSize} strokeWidth={2.2} />
          ),
        }}
      />
    </Tabs>
  );
}
