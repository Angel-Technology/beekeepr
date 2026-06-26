import { Drawer } from 'expo-router/drawer';
import { DrawerContentSwitcher } from '@features/home/presentation/components/drawer/DrawerContentSwitcher';
import { themedColors, useThemedColor } from '@common';

export default function PrivateDrawerLayout() {
  const sceneBg = useThemedColor(themedColors.bg.primary);
  return (
    <Drawer
      drawerContent={(props) => <DrawerContentSwitcher {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerPosition: 'right',
        swipeEdgeWidth: 150,
        drawerStyle: {
          width: '88%',
        },
        sceneStyle: { backgroundColor: sceneBg },
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
