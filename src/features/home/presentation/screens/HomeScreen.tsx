import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { ArrowRight, Menu } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  ButtonWithIcon,
  Card,
  IconButton,
  VerificationStatusPill,
} from '@components';
import { Image } from 'expo-image';
import { appImages } from '@src/assets/images';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const bottomInsetPadding = Math.max(insets.bottom, 12);
  const topMaskHeight = headerOffset + 8;
  const contentTopInset = headerOffset + 12;
  const bottomMaskHeight = 58 + bottomInsetPadding;
  const headerVisibility = useSharedValue(1);
  const previousScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = Math.max(event.contentOffset.y, 0);
      const deltaY = currentY - previousScrollY.value;

      if (currentY <= 24) {
        headerVisibility.value = withTiming(1, { duration: 180 });
      } else if (deltaY > 6) {
        headerVisibility.value = withTiming(0, { duration: 180 });
      } else if (deltaY < -4) {
        headerVisibility.value = withTiming(1, { duration: 180 });
      }

      previousScrollY.value = currentY;
    },
  });

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
        floating
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        showTopMask
        topMaskHeight={topMaskHeight}
        center={
          <Text className="text-center font-poppins-semiBold text-700 text-text-default">
            TheBuzz
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={26} strokeWidth={2.6} />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />
      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0.32)',
          'rgba(255, 255, 255, 0.82)',
          'rgba(255, 255, 255, 1)',
        ]}
        locations={[0, 0.34, 0.72, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: bottomMaskHeight,
          zIndex: 8,
        }}
      />
      <Animated.ScrollView
        className="w-full"
        contentContainerClassName="gap-6 px-lg"
        contentContainerStyle={{
          paddingTop: contentTopInset,
          paddingBottom: bottomMaskHeight + 20,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Card className="border-weak flex flex-col items-center justify-center gap-xl rounded-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <View className="flex flex-row items-start justify-center gap-1 self-stretch">
                <Text className="text-center font-poppins-semiBold text-900 text-text-default">
                  Join TheBuzz
                </Text>
                <Image
                  source={appImages.betaLogo}
                  contentFit="contain"
                  style={{ width: 32, height: 14 }}
                />
              </View>
              <Text className="text-center font-sourceSans-regular text-700 text-text-default">
                30-day Free Trial
              </Text>
              <Text className="text-center font-sourceSans-regular text-600 text-text-default">
                $9.95/month
              </Text>
            </View>
          </View>

          <VerificationStatusPill
            label="ID verified / No criminal records found"
            textClassName="text-400"
          />

          <Text className="text-center font-poppins-regular text-400 text-text-default">
            It’s proven that people with visible trust signals receive more
            engagement.
          </Text>

          <ButtonWithIcon
            label="Get started"
            className="min-h-[64px] rounded-[28px] px-lg"
            iconRight={
              <ArrowRight color="#FFFFFF" size={24} strokeWidth={2.2} />
            }
            onPress={() => {
              router.push('/verify-identity');
            }}
          />
        </Card>
      </Animated.ScrollView>
    </View>
  );
};
