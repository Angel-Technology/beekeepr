import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import { Card, Pill } from '@components';

const HEADLINE = 'On dating apps?';
const BODY =
  'Find Dating apps that we partner with and care about your safety.';

export const DatingAppsExploreCard = () => {
  return (
    <Card className="flex-row items-center gap-4 rounded-xl pl-6 pr-4">
      <Image
        source={appImages.illustrationTrial}
        style={{ width: 110, height: 162 }}
        contentFit="contain"
      />
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
    </Card>
  );
};
