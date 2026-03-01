import { Text, View } from 'react-native';

type DetailCardProps = {
  title: string;
  items: string[];
};

export const DetailCard = ({ title, items }: DetailCardProps) => {
  return (
    <View className="flex flex-col items-start gap-1 self-stretch rounded-4 bg-brand-secondary p-5">
      <Text className="items-stretch font-sourceSans-semiBold text-400 leading-300 text-text-default">
        {title}
      </Text>
      <View className="gap-1 pl-sm">
        {items.map((item) => (
          <View key={item} className="flex-row gap-2">
            <Text className="font-sourceSans-regular text-400 leading-300 text-text-secondary">
              •
            </Text>
            <Text className="font-sourceSans-regular text-400 text-text-secondary">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
