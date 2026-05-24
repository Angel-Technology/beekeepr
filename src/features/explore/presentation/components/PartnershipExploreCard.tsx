import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import { Card, CompactButton } from '@components';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';

const HEADLINE = 'Want to partner with us?';
const BODY =
  'If you’re a dating app, dating coach, or planning events, we’d love to partner with you.';
const CTA_LABEL = 'Contact us about partnerships';

export const PartnershipExploreCard = () => {
  const handleContactPress = () => {
    openInAppBrowser(environmentConfig.partnershipsURL);
  };

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

      <CompactButton
        label={CTA_LABEL}
        textClassName="text-sm"
        onPress={handleContactPress}
      />
    </Card>
  );
};
