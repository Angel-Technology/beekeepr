import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import { Card, CompactButton } from '@components';

const HEADLINE = 'STI/STD Screening Info';
const BODY = 'Get more information and find STI screening locations near you.';

export const STIScreeningExploreCard = () => {
  return (
    <Card className="items-center gap-4 rounded-xl p-6">
      <View className="w-full gap-2">
        <Text className="font-poppins-semiBold text-xl text-text-default">
          {HEADLINE}
        </Text>
        <Text className="font-lexend-regular text-base leading-5 text-text-weak">
          {BODY}
        </Text>
      </View>
      <Image
        source={appImages.location}
        style={{ width: 209, height: 178 }}
        contentFit="cover"
      />
      <CompactButton label="Coming soon..." variant="tinted" />
    </Card>
  );
};
