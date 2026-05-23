import { useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appImages } from '@assets/images';
import { AppHeader, Button, IconButton } from '@components';
import { useErrorModal } from '@src/lib/error-modal';

const PARTNERSHIP_EMAIL = 'partnerships@buzzkeepr.com';
const PARTNERSHIP_MAILTO = `mailto:${PARTNERSHIP_EMAIL}`;

const HEADLINE = 'Want to partner with us?';
const BODY =
  'If you’re a dating app, dating coach, or planning events, we’d love to partner with you.';
const CTA_LABEL = 'Contact us about partnerships';
const PERK_LABEL = '~ Free for life ~ for founding partners';

export const PartnershipScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const errorModal = useErrorModal();

  const handleContactPress = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(PARTNERSHIP_MAILTO);
      if (!supported) {
        errorModal.showError({
          title: 'No mail app found',
          message: `Reach us at ${PARTNERSHIP_EMAIL}.`,
        });
        return;
      }
      await Linking.openURL(PARTNERSHIP_MAILTO);
    } catch (error) {
      errorModal.showFromError(error, 'Could not open mail');
    }
  }, [errorModal]);

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={<ChevronLeft size={24} strokeWidth={2.2} color="#000000" />}
            onPress={() => router.back()}
          />
        }
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
            Partnerships
          </Text>
        }
      />

      <View
        className="flex-1 px-6 pt-6"
        style={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="gap-1 px-1">
          <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
            {HEADLINE}
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
            {BODY}
          </Text>
        </View>

        <View className="flex-1 items-center justify-end gap-8">
          <Image
            source={appImages.partnerships}
            style={{ width: 270, height: 186 }}
            contentFit="cover"
          />

          <View className="w-full gap-2">
            <Button label={CTA_LABEL} onPress={handleContactPress} />
            <View className="w-full items-center justify-center rounded-3 bg-brand-lime pb-px">
              <Text className="font-lexend-light text-sm leading-5 text-text-default">
                {PERK_LABEL}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
