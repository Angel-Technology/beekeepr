import { View } from 'react-native';
import { ProfileScreen } from '@features/account';
import { DrawerBlurOverlay } from '@features/home/presentation/components/drawer/DrawerBlurOverlay';

export default function ProfilePage() {
  return (
    <View className="flex-1">
      <ProfileScreen />
      <DrawerBlurOverlay />
    </View>
  );
}
