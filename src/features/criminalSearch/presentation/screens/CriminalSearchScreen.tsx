import { Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, BOTTOM_TAB_BAR_HEIGHT, IconButton } from '@components';
import {
  ComingSoonOverlay,
  PhoneSearchMock,
  WhatYoullFindCard,
} from '../components';

export const CriminalSearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
            Lookups
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} color="#000000" />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />

      <View
        className="flex-1 px-6"
        style={{
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 16,
        }}
      >
        <View className="opacity-50">
          <PhoneSearchMock />
        </View>

        <View className="flex-1 justify-end gap-3">
          <ComingSoonOverlay />
          <WhatYoullFindCard />
        </View>
      </View>
    </View>
  );
};
