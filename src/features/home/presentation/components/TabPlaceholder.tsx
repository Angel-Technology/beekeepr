import { Text, View } from 'react-native';

type TabPlaceholderProps = {
  title: string;
  description: string;
};

export const TabPlaceholder = ({ title, description }: TabPlaceholderProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-bg-default px-lg">
      <Text className="text-center font-poppins-semiBold text-700 text-text-default">
        {title}
      </Text>
      <Text className="text-center font-sourceSans-regular text-base text-text-secondary">
        {description}
      </Text>
    </View>
  );
};
