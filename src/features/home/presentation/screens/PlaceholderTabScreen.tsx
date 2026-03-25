import { Text, View } from 'react-native';
import { Card, Container } from '@components';

type PlaceholderTabScreenProps = {
  title: string;
  description: string;
};

export const PlaceholderTabScreen = ({
  title,
  description,
}: PlaceholderTabScreenProps) => {
  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-bg-default"
    >
      <View className="flex-1 items-center justify-center self-stretch px-lg">
        <Card className="w-full p-xl">
          <Text className="font-poppins-semiBold text-800 text-text-default">
            {title}
          </Text>
          <Text className="mt-3 font-sourceSans-regular text-lg leading-7 text-text-secondary">
            {description}
          </Text>
        </Card>
      </View>
    </Container>
  );
};
