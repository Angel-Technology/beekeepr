import { useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import { Card, CompactButton } from '@components';
import { useErrorModal } from '@src/lib/error-modal';

const PARTNERSHIP_EMAIL = 'partnerships@buzzkeepr.com';
const PARTNERSHIP_MAILTO = `mailto:${PARTNERSHIP_EMAIL}`;
const HEADLINE = 'Want to partner with us?';
const BODY =
  'If you’re a dating app, dating coach, or planning events, we’d love to partner with you.';
const CTA_LABEL = 'Contact us about partnerships';
const PERK_LABEL = '~ Free for life ~ for founding partners';

export const PartnershipExploreCard = () => {
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
    <Card className="gap-6 rounded-xl pl-6 pr-4">
      <View className="gap-2">
        <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
          {HEADLINE}
        </Text>
        <View className="flex-row items-center gap-4">
          <View className="flex-1 gap-2">
            <Text className="font-lexend-regular text-sm leading-5 text-text-weak">
              {BODY}
            </Text>
          </View>
          <Image
            source={appImages.partnerships}
            style={{ width: 130, height: 90 }}
            contentFit="cover"
          />
        </View>
      </View>

      <View className="gap-2">
        <CompactButton
          label={CTA_LABEL}
          textClassName="text-sm"
          onPress={handleContactPress}
        />
        <View className="w-full items-center justify-center rounded-md bg-brand-lime py-1">
          <Text className="font-lexend-light text-sm leading-5 text-text-default">
            {PERK_LABEL}
          </Text>
        </View>
      </View>
    </Card>
  );
};
