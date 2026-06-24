import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flag, ShieldAlert, Trash2, User } from 'lucide-react-native';
import { AppHeader, Divider } from '@components';
import { useAuthSession } from '@features/auth';
import { formatJoinedDate } from '../../models/formatJoinedDate';

const AVATAR_SIZE = 64;

const SAFETY_DISCLAIMER =
  'BUZZKEEPR™ DOES NOT CLAIM THAT PEOPLE ARE SAFE! We can only find records if they exist and we have access to them. If we don’t find records, this doesn’t mean they didn’t commit a crime.';

const formatHandle = (handle: string | null | undefined) => {
  if (!handle) {
    return '';
  }
  const trimmed = handle.trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

export const ProfileDrawerContent = (_props: DrawerContentComponentProps) => {
  const insets = useSafeAreaInsets();
  const { data: user } = useAuthSession();

  const displayName = user?.nickname?.trim() || 'Member';
  const displayHandle = formatHandle(user?.handle);
  const memberSince = formatJoinedDate(user?.createdAtUtc);

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
            Preview
          </Text>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center bg-bg-success px-4 py-2">
          <Text className="font-lexend-regular text-base text-text-inverse">
            This is how others see you.
          </Text>
        </View>

        <View className="flex-row items-center gap-3 px-6">
          <View className="size-[64px] items-center justify-center overflow-hidden rounded-round bg-brand-primary">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            ) : (
              <User size={30} color="#FFFFFF" />
            )}
          </View>
          <View className="flex-1">
            <Text
              className="font-poppins-semiBold text-2xl leading-tight text-text-default"
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {displayHandle ? (
              <Text
                className="font-lexend-regular text-footnote leading-[18px] text-text-default"
                numberOfLines={1}
              >
                {displayHandle}
              </Text>
            ) : null}
            {memberSince ? (
              <Text className="font-lexend-regular text-footnote leading-[18px] text-text-tertiary">
                member since: {memberSince}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="flex-row gap-2 px-6">
          <Pressable
            accessibilityRole="button"
            className="flex-1 flex-row items-center justify-center gap-2 rounded-round border border-border-weak px-3 py-2"
          >
            <Flag size={16} color="rgba(0,0,0,0.7)" />
            <Text className="font-lexend-semiBold text-sm text-text-secondary">
              Flag
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="flex-1 flex-row items-center justify-center gap-2 rounded-round border border-border-weak px-3 py-2"
          >
            <Trash2 size={16} color="rgba(0,0,0,0.7)" />
            <Text className="font-lexend-semiBold text-sm text-text-secondary">
              Remove
            </Text>
          </Pressable>
        </View>

        <View className="mx-6 gap-4 rounded-5 border border-border-weak p-4">
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 font-lexend-semiBold text-base text-text-default">
              Buzz Badge
              <Text className="font-lexend-regular text-caption leading-4 text-text-secondary">
                {'  '}(status updated every 6 months)
              </Text>
            </Text>
          </View>
          <View className="gap-1">
            <View className="flex-row justify-between rounded-1 bg-bg-weak px-1 py-1.5">
              <Text className="font-lexend-regular text-footnote leading-none text-text-secondary">
                Last screened
              </Text>
              <Text className="font-lexend-regular text-footnote leading-none text-text-default">
                —
              </Text>
            </View>
            <View className="flex-row justify-between rounded-1 px-1 py-1.5">
              <Text className="font-lexend-regular text-footnote leading-none text-text-secondary">
                Next screening
              </Text>
              <Text className="font-lexend-regular text-footnote leading-none text-text-default">
                —
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 gap-2 rounded-5 bg-bg-weak p-4">
          <View className="flex-row items-center gap-2">
            <View className="items-center justify-center rounded-round border-2 border-text-critical p-2">
              <ShieldAlert size={20} />
            </View>
            <Text className="flex-1 font-lexend-semiBold text-base text-text-default">
              Safety is not a guarantee!
            </Text>
          </View>
          <Text className="font-lexend-regular text-footnote leading-[18px] text-text-default">
            <Text className="font-lexend-regular">
              The Buzz Badge is not a guarantee of safety!{' '}
            </Text>
            It’s a meaningful signal from someone who chose to be accountable.
          </Text>
          <Text className="font-lexend-regular text-footnote leading-[18px] text-text-default">
            Always use discernment and recommended safety practices when meeting
            anyone new.
          </Text>
          <Divider className="my-2" />
          <Text className="font-lexend-regular text-caption leading-4 text-text-secondary">
            {SAFETY_DISCLAIMER}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
