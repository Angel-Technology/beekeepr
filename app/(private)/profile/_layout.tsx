import { useEffect, useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useDrawerStatus } from '@react-navigation/drawer';
import { ProfileDrawerContent } from '@features/account';

/**
 * Drawer status → `swipeEnabled` binding. Lives inside `drawerContent`
 * so it has access to the drawer's navigation context (which is what
 * `useDrawerStatus` reads from). The effect lifts the open/closed state
 * up to the layout so `screenOptions` can re-render with the new value.
 *
 * Why we need this: `swipeEnabled` is one flag for both open and close
 * gestures. We want close-swipe but not open-swipe (the preview card is
 * the only way in), so we toggle the flag based on drawer state — `true`
 * while open (allows close), `false` while closed (blocks open).
 */
const SwipeBinding = ({
  onStatusChange,
}: {
  onStatusChange: (open: boolean) => void;
}) => {
  const status = useDrawerStatus();
  useEffect(() => {
    onStatusChange(status === 'open');
  }, [status, onStatusChange]);
  return null;
};

export default function ProfileDrawerLayout() {
  const [swipeEnabled, setSwipeEnabled] = useState(false);

  return (
    <Drawer
      drawerContent={(props) => (
        <>
          <SwipeBinding onStatusChange={setSwipeEnabled} />
          <ProfileDrawerContent {...props} />
        </>
      )}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerPosition: 'right',
        swipeEnabled,
        swipeEdgeWidth: 0,
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
