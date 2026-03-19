import { Text, View } from 'react-native';
import { Button, Container } from '@components';
import { useAuthActions } from '@features/auth';

export default function PrivateHomePage() {
  const { signOut } = useAuthActions();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-bg-default"
    >
      <View className="flex-1 items-center justify-center gap-6 self-stretch">
        <Text className="font-poppins-semiBold text-700 text-text-default">
          Private
        </Text>
        <Button
          label="Log Out"
          className="w-full"
          loading={signOut.isPending}
          onPress={() => {
            signOut.mutate();
          }}
        />
      </View>
    </Container>
  );
}
