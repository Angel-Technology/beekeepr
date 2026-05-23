import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import { Card, Pill } from '@components';

const HEADLINE = 'STI Screening';
const BODY = 'Get more information and find STI screening locations near you.';

export const STIScreeningExploreCard = () => {
  return (
    <Card tone="brand" className="flex-row items-center gap-2 rounded-xl">
      <View className="flex-1 gap-4">
        <View className="gap-2">
          <Text className="font-lexend-semiBold text-base leading-tight text-text-default">
            {HEADLINE}
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-weak">
            {BODY}
          </Text>
        </View>
        <Pill label="Coming soon..." tone="tinted" />
      </View>
      <Image
        source={appImages.location}
        style={{ width: 140, height: 110 }}
        contentFit="cover"
      />
    </Card>
  );
};
