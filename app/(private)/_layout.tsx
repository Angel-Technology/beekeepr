import { Stack } from 'expo-router';
import {
  TermsAcceptanceModal,
  hasAcceptedCurrentTerms,
  useAuthActions,
  useAuthSession,
} from '@features/auth';

export default function PrivateLayout() {
  const { data: user } = useAuthSession();
  const { acceptTerms, signOut } = useAuthActions();
  const shouldShowTermsModal = Boolean(user) && !hasAcceptedCurrentTerms(user);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(main)" />
        <Stack.Screen
          name="verify-identity"
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="buzz-records"
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="buy-pro"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>

      <TermsAcceptanceModal
        visible={shouldShowTermsModal}
        isAccepting={acceptTerms.isPending}
        isDeclining={signOut.isPending}
        onAccept={() => {
          acceptTerms.mutate();
        }}
        onDecline={() => {
          signOut.mutate();
        }}
      />
    </>
  );
}
