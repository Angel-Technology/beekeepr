import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { appImages, type AppImageSource } from '@assets/images';
import { OnboardingPager } from '../components/OnboardingPager';
import { OnboardingSlideCard } from '../components/OnboardingSlideCard';

type WhatYouWillFindSection = {
  title: string;
  items: string[];
};

type OnboardingSlide = {
  title: string;
  titleIcon?: AppImageSource;
  subtitle?: string;
  bullets?: string[];
  imageVariant: 'join' | 'search' | 'map';
  footer: WhatYouWillFindSection;
};

const slides: OnboardingSlide[] = [
  {
    title: 'Join TheBuzz',
    titleIcon: appImages.betaLogo,
    subtitle:
      'Stand out in the crowd! It’s proven that people with visible trust signals receive more engagement.',
    imageVariant: 'join',
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
    subtitle: 'What you need to find someone',
    bullets: ['Phone number or email address', 'First & last name and city'],
    imageVariant: 'search',
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
    imageVariant: 'map',
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

function SlideIllustration({
  variant,
  index,
  x,
  screenWidth,
}: {
  variant: OnboardingSlide['imageVariant'];
  index: number;
  x: SharedValue<number>;
  screenWidth: number;
}) {
  const imageAnimation = useAnimatedStyle(() => {
    const translateY = interpolate(
      x.value,
      [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      [40, 0, -40],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      x.value,
      [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  if (variant === 'join') {
    return (
      <Animated.View
        className="mb-3 mt-2 h-[132px] flex-row items-end justify-center gap-1"
        style={imageAnimation}
      >
        <Image
          source={appImages.awkwardBee}
          contentFit="contain"
          style={{ width: 104, height: 104, transform: [{ scaleX: -1 }] }}
        />
        <Image
          source={appImages.awkwardBee}
          contentFit="contain"
          style={{ width: 104, height: 104 }}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View className="my-3 items-center" style={imageAnimation}>
      <Image
        source={appImages.awkwardBee}
        contentFit="contain"
        style={{ width: variant === 'search' ? 120 : 132, height: 120 }}
      />
      {variant === 'map' ? (
        <View className="mt-2 h-10 w-[150px] rounded-[18px] border border-border-subtle bg-bg-primarySubtle" />
      ) : null}
    </Animated.View>
  );
}

export function OnboardingWhatWeDoScreen() {
  const router = useRouter();

  return (
    <OnboardingPager
      data={slides}
      keyExtractor={(slide) => slide.title}
      onExit={() => router.replace('/')}
      title="What we do"
      subtitle="We help you feel safer meeting new people."
      renderSlide={({ item: slide, index, x, screenWidth }) => (
        <OnboardingSlideCard
          title={slide.title}
          titleIcon={slide.titleIcon}
          subtitle={slide.subtitle}
          bullets={slide.bullets}
          image={
            <SlideIllustration
              variant={slide.imageVariant}
              index={index}
              x={x}
              screenWidth={screenWidth}
            />
          }
          detailTitle={slide.footer.title}
          detailItems={slide.footer.items}
        />
      )}
    />
  );
}
