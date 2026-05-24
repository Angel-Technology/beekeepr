import { Drawer } from 'expo-router/drawer';
import { MenuDrawerContent } from '@features/account';

export default function PrivateDrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <MenuDrawerContent {...props} />}
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
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
    </Drawer>
  );
}
