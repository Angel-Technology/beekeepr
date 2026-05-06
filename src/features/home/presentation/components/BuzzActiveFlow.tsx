import { ArrowRight } from 'lucide-react-native';
import { appImages } from '@assets/images';
import { Button } from '@components';
import { Image, Text, View } from 'react-native';

type BuzzActiveFlowProps = {
  onReviewSubmittedInfo: () => void;
};

export const BuzzActiveFlow = ({
  onReviewSubmittedInfo,
}: BuzzActiveFlowProps) => {
  return (
    <View className="gap-5">
      <View className="flex-row items-start gap-4">
        <Image
          source={appImages.beeBadge}
          resizeMode="contain"
          style={{ width: 56, height: 56 }}
        />
        <View className="flex-1 gap-2">
          <Text className="font-poppins-semiBold text-700 text-text-default">
            Background check submitted
          </Text>
          <Text className="font-sourceSans-regular text-base leading-6 text-text-secondary">
            This is the placeholder state for the future “Congrats! You’re in.”
            screen. Your records form has been completed successfully.
          </Text>
        </View>
      </View>

      <Button
        label="Review submitted info"
        iconRight={<ArrowRight color="#FFFFFF" size={18} strokeWidth={2.2} />}
        onPress={onReviewSubmittedInfo}
      />
    </View>
  );
};
