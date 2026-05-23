import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, IconButton } from '@components';

type AccountPlaceholderScreenProps = {
  title: string;
};

export const AccountPlaceholderScreen = ({
  title,
}: AccountPlaceholderScreenProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={<ChevronLeft size={24} strokeWidth={2.2} />}
            onPress={() => router.back()}
          />
        }
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
            {title}
          </Text>
        }
      />
      <View className="flex-1" />
    </View>
  );
};
