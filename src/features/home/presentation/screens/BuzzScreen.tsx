import { Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  IconButton,
  VerticalSpacer,
} from '@components';
import { useBuzzTab } from '../../hooks/useBuzzTab';
import {
  BuzzActiveFlow,
  BuzzDeniedFlow,
  BuzzVerifyFlow,
  BuzzWelcomeFlow,
} from '../components';

export const BuzzScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;
  const headerVisibility = useSharedValue(1);
  const {
    flow,
    ctaLabel,
    onGetStarted,
    onLearnMore,
    resetSubmittedBackgroundCheck,
  } = useBuzzTab();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: (1 - headerVisibility.value) * -headerOffset,
        },
      ],
      opacity: headerVisibility.value,
    };
  });

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        topMaskHeight={topMaskHeight}
        center={
          <View className="flex-row items-start justify-center gap-1">
            <Text className="font-poppins-semiBold text-base text-text-default">
              TheBuzz
            </Text>

            <View className="items-center justify-center rounded bg-brand-highlight px-[3px] py-[1px]">
              <Text className="font-sourceSans-semiBold text-[7px] text-text-default">
                BETA
              </Text>
            </View>
          </View>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />

      <View
        className="flex-1 gap-6 px-5"
        style={{ paddingBottom: Math.max(insets.bottom + 32, 48) }}
      >
        <VerticalSpacer size="xs" />
        {flow === 'verify' ? (
          <BuzzVerifyFlow
            ctaLabel={ctaLabel}
            onGetStarted={onGetStarted}
            onLearnMore={onLearnMore}
          />
        ) : null}
        {flow === 'welcome' ? <BuzzWelcomeFlow /> : null}
        {flow === 'active' ? (
          <BuzzActiveFlow
            onReviewSubmittedInfo={() => {
              resetSubmittedBackgroundCheck();
            }}
          />
        ) : null}
        {flow === 'denied' ? <BuzzDeniedFlow /> : null}
      </View>
    </View>
  );
};
