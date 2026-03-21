import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Container } from '@components';
import {
  IdentityVerificationStatus,
  useAuthActions,
  useAuthSession,
} from '@features/auth';

export default function PrivateHomePage() {
  const router = useRouter();
  const { data: user } = useAuthSession();
  const { signOut } = useAuthActions();

  useEffect(() => {
    if (
      user &&
      user.identityVerificationStatus !== IdentityVerificationStatus.Approved
    ) {
      router.replace('/verify-identity');
    }
  }, [router, user]);

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
          label="Verify Identity"
          variant="outline"
          className="w-full"
          onPress={() => {
            router.push('/verify-identity');
          }}
        />
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
