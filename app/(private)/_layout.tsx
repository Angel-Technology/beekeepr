import { Stack } from 'expo-router';
import { themedColors, useThemedColor } from '@common';
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
  // Theme-aware screen container so push/pop transitions (e.g.
  // tab→profile→back) don't expose the Stack's default white
  // background mid-animation.
  const screenBg = useThemedColor(themedColors.bg.primary);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: screenBg },
        }}
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="verify-identity" />
        <Stack.Screen
          name="verify-learn-more"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="profile" />
        <Stack.Screen name="delete-account" />
        <Stack.Screen name="account" />
        <Stack.Screen name="legal" />
        <Stack.Screen name="settings" />
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
