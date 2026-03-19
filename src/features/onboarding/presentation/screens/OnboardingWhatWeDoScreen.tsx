import { useRouter } from 'expo-router';
import { appImages } from '@assets/images';

import { OnboardingFlow } from '../components/OnboardingFlow';
import { WhatWeDoStepCard } from '../components/WhatWeDoStepCard';

type OnboardingSlide = {
  title: string;
  badgeLabel: string;
  image: {
    source: typeof appImages.verifyBee;
    width: number;
    height: number;
  };
};

const slides: OnboardingSlide[] = [
  {
    title: 'First, we’ll verify your identity.',
    badgeLabel: 'ID verified',
    image: {
      source: appImages.verifyBee,
      width: 263,
      height: 278,
    },
  },
  {
    title: 'Then, we’ll search our criminal database.',
    badgeLabel: 'No criminal records found',
    image: {
      source: appImages.investigateBee,
      width: 243,
      height: 270,
    },
  },
  {
    title: 'Share your results and start connecting!',
    badgeLabel: 'ID verified / No criminal records',
    image: {
      source: appImages.beeBadge,
      width: 271,
      height: 354,
    },
  },
];

export const OnboardingWhatWeDoScreen = () => {
  const router = useRouter();

  return (
    <OnboardingFlow
      data={slides}
      keyExtractor={(slide) => slide.title}
      onComplete={() => router.replace('/onboarding/create-account')}
      renderSlide={({ item: slide }) => (
        <WhatWeDoStepCard
          badgeLabel={slide.badgeLabel}
          title={slide.title}
          image={slide.image.source}
          imageWidth={slide.image.width}
          imageHeight={slide.image.height}
        />
      )}
    />
  );
};
