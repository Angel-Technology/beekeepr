import { Drawer } from 'expo-router/drawer';
import { ProfileDrawerContent } from '@features/account';

export default function ProfileDrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <ProfileDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerPosition: 'right',
        swipeEdgeWidth: 150,
        drawerStyle: {
          width: '88%',
        },
        sceneStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
        }}
      />
    </Drawer>
  );
}
