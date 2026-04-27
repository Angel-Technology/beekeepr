import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu } from 'lucide-react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  IconButton,
  VerticalSpacer,
} from '@components';
import { useBuzzScreen } from '../../hooks/useBuzzScreen';
import { BuzzActiveFlow, BuzzVerifyFlow } from '../components';

export const BuzzScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;
  const headerVisibility = useSharedValue(1);
  const { flow, resetSubmittedBackgroundCheck } = useBuzzScreen();

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
          <View className="flex-row items-start justify-center gap-3">
            <Text className="font-poppins-semiBold text-2xl text-text-default">
              TheBuzz
            </Text>
            <LinearGradient
              colors={['#FFBF00', '#FFBF00', '#F3FF00']}
              locations={[0, 0.3861, 0.8159]}
              start={{ x: 0.88, y: 0.92 }}
              end={{ x: 0.12, y: 0.18 }}
              style={{ borderRadius: 4, overflow: 'hidden' }}
            >
              <View className="px-[3px] py-[0.5px]">
                <Text className="font-sourceSans-semiBold text-[10px] text-text-default">
                  BETA
                </Text>
              </View>
            </LinearGradient>
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom + 32, 48),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <VerticalSpacer size="xs" />
          {flow === 'verify' ? <BuzzVerifyFlow /> : null}
          {flow === 'active' ? (
            <BuzzActiveFlow
              onReviewSubmittedInfo={() => {
                resetSubmittedBackgroundCheck();
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};
