import { Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { IconButton } from '@components';
import { themedColors, useThemedColor } from '@common';

type VerificationTopNavProps = {
  onPressBack: () => void;
};

export const VerificationTopNav = ({
  onPressBack,
}: VerificationTopNavProps) => {
  const iconColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="w-full flex-row items-center justify-between">
      <IconButton
        accessibilityLabel="Go back"
        className="border-none bg-transparent"
        icon={<ChevronLeft size={24} strokeWidth={2.2} color={iconColor} />}
        onPress={onPressBack}
      />
      <Text className="font-poppins-semiBold text-base text-tk-text-primary">
        Get the Buzz Badge
      </Text>
      <View className="h-[44px] w-[44px]" />
    </View>
  );
};
