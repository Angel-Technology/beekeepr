import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaperOnboarding } from '@components';
import { whatWeDoSlides } from '../../models/whatWeDoSlides';

export const OnboardingWhatWeDoScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <PaperOnboarding
      data={[...whatWeDoSlides]}
      safeInsets={{
        top: insets.top + 16,
        bottom: insets.bottom + 24,
        left: 24,
        right: 24,
      }}
      closeButtonText="Get Started"
      closeButtonTextStyle={{
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
      }}
      indicatorBackgroundColor="#FFFFFF"
      indicatorBorderColor="#FFFFFF"
      onCloseButtonPress={() => router.replace('/onboarding/create-account')}
    />
  );
};
