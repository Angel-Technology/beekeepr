import clsx from 'clsx';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, type ImageStyle } from 'react-native';

import { appImages, type AppImageSource } from '@assets/images';
import { OnboardingFlow } from '../components/OnboardingFlow';
import {
  OnboardingSlideCard,
  type OnboardingSlideSubtitle,
} from '../components/OnboardingSlideCard';

type WhatYouWillFindSection = {
  title: string;
  items: string[];
};

type OnboardingSlide = {
  title: string;
  titleIcon?: AppImageSource;
  subtitle?: OnboardingSlideSubtitle;
  image: {
    source: AppImageSource;
    className?: string;
    style: ImageStyle;
  };
  footer: WhatYouWillFindSection;
};

const slides: OnboardingSlide[] = [
  {
    title: 'Join TheBuzz',
    titleIcon: appImages.betaLogo,
    subtitle: {
      body: 'Stand out in the crowd! It’s proven that people with visible trust signals receive more engagement.',
    },
    image: {
      source: appImages.theBuzz,
      className: 'items-center justify-center',
      style: { width: 313, height: 190 },
    },
    footer: {
      title: 'What you’ll show others',
      items: [
        'That you are who you say you are',
        'You haven’t committed any fraud',
        'You have no violent crimes on your record',
        'You’re not on a sex offender list',
      ],
    },
  },
  {
    title: 'Identity & Criminal Searches',
    subtitle: {
      header: 'What you need to find someone',
      list: ['Phone number or email address', 'First & last name and city'],
    },
    image: {
      source: appImages.search,
      className: 'items-end justify-center',
      style: { width: 161, height: 172 },
    },
    footer: {
      title: 'What you’ll find',
      items: [
        'Their real age, marriage and/or divorce records, aliases, addresses, phone numbers, email addresses, related to, associated with',
        'Sex Offender Registry',
        'Criminal records, Warrants, Arrest records',
        'Traffic records',
        'Bankruptcies, Foreclosures, Tax Liens',
      ],
    },
  },
  {
    title: 'Find STI Screening Locations',
    image: {
      source: appImages.locations,
      className: 'items-center justify-center',
      style: { width: 313, height: 237 },
    },
    footer: {
      title: 'What you’ll find',
      items: [
        'Information on STI & STD screening',
        'Nearest locations and prices (if available)',
        'Any nonprofit information for free screening in your area',
      ],
    },
  },
];

export const OnboardingWhatWeDoScreen = () => {
  const router = useRouter();

  return (
    <OnboardingFlow
      data={slides}
      keyExtractor={(slide) => slide.title}
      onExit={() => router.replace('/')}
      onComplete={() => router.replace('/onboarding/create-account')}
      title="What we do"
      subtitle="We help you feel safer meeting new people."
      renderSlide={({ item: slide }) => (
        <OnboardingSlideCard
          title={slide.title}
          titleIcon={slide.titleIcon}
          subtitle={slide.subtitle}
          image={
            <View
              className={clsx(
                'w-full flex-1 self-stretch',
                slide.image.className ?? 'items-center justify-center',
              )}
            >
              <Image
                source={slide.image.source}
                contentFit="contain"
                style={slide.image.style}
              />
            </View>
          }
          detailTitle={slide.footer.title}
          detailItems={slide.footer.items}
        />
      )}
    />
  );
};
