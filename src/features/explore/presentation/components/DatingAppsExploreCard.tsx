import { Text, View } from 'react-native';
import IllustrationAward from '@src/assets/svg/IllustrationAward';
import { Card, CompactButton } from '@components';

const HEADLINE = 'On dating apps?';
const BODY =
  'Find Dating apps that we partner with and care about your safety.';

export const DatingAppsExploreCard = () => {
  return (
    <Card className="gap-2 rounded-xl p-6">
      <Text className="font-poppins-semiBold text-xl text-text-default">
        {HEADLINE}
      </Text>
      <View className="flex-row items-center gap-4">
        <View className="flex-1 flex-col justify-between gap-4 self-stretch">
          <Text className="font-lexend-regular text-base leading-5 text-text-weak">
            {BODY}
          </Text>
          <CompactButton label="Coming soon..." variant="tinted" />
        </View>
        <IllustrationAward
          width={123}
          height={180}
          style={{ transform: [{ scaleX: -1 }] }}
        />
      </View>
    </Card>
  );
};
