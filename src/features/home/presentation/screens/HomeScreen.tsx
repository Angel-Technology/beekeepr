import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import {
  ArrowRight,
  FolderX,
  IdCard,
  Menu,
  ReceiptText,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  ButtonWithIcon,
  Card,
  DetailCard,
  IconButton,
  VerificationStatusPill,
  VerticalSpacer,
} from '@components';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;
  const headerVisibility = useSharedValue(1);

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
      <View className="w-full gap-6 px-lg">
        <VerticalSpacer size="xs" />
        <Card className="border-secondary flex flex-col items-center justify-center gap-6 rounded-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1">
              <View className="flex flex-row items-start justify-center gap-1 self-stretch">
                <Text className="text-center font-poppins-semiBold text-800 text-text-default">
                  Join TheBuzz
                </Text>
              </View>
              <Text className="text-center font-poppins-regular text-xl text-text-default">
                7-day Free Trial
              </Text>
              <Text className="text-center font-poppins-regular text-base text-text-default">
                $9.95/month
              </Text>
            </View>
          </View>

          <VerificationStatusPill
            label="ID verified / No criminal records found"
            size="sm"
          />

          <Text className="text-center font-poppins-regular text-400 text-text-default">
            It&apos;s proven that people with visible trust signals get more
            matches.
          </Text>

          <DetailCard
            title="What you’ll show others"
            className="gap-5 rounded-5 px-5 py-5"
            titleClassName="font-poppins-semiBold text-base text-text-default"
            itemsClassName="gap-3 pl-0"
            itemTextClassName="font-poppins-regular text-sm text-text-secondary"
            items={[
              {
                id: 'id-verified',
                label: 'ID Verified',
                icon: <IdCard size={14} color="#111111" />,
              },
              {
                id: 'no-violent-crimes',
                label: 'No violent crimes found',
                icon: <FolderX size={14} color="#111111" />,
              },
              {
                id: 'not-on-registry',
                label: 'Not on a sex offender registry',
                icon: <ReceiptText size={14} color="#111111" />,
              },
            ]}
          />

          <ButtonWithIcon
            label="Get started"
            size="lg"
            iconRight={
              <ArrowRight color="#FFFFFF" size={24} strokeWidth={2.2} />
            }
            onPress={() => {
              router.push('/verify-identity');
            }}
          />
        </Card>
      </View>
    </View>
  );
};
