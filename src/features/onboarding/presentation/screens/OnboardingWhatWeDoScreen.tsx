import { useMemo } from 'react';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react-native';

import { appImages } from '@assets/images';
import IllustrationBadge from '@assets/svg/IllustrationBadge';
import IntroBeeIcon from '@assets/svg/IntroBeeIcon';
import {
  BuzzButton,
  PaperOnboarding,
  type PaperOnboardingItemType,
} from '@components';
import { WhatWeDoSlide } from '../components/WhatWeDoSlide';

const IntroBeeIndicator = ({ size }: { size: number }) => (
  <IntroBeeIcon width={size} height={(size * 14) / 16} color="#000000" />
);

const CANVAS_HONEY = '#FCD216';
const CANVAS_LIME = '#EDF903';

const BODY_CLASS_NAME =
  'text-center font-lexend-regular text-base text-tk-gray-black -tracking-[0.3px]';

type IllustrationFrameProps = {
  source: number;
  width: number;
  height: number;
};

const ILLUSTRATION_FRAME_HEIGHT = 340;

const IllustrationFrame = ({
  source,
  width,
  height,
}: IllustrationFrameProps) => (
  <View
    className="items-center justify-center self-stretch"
    style={{ height: ILLUSTRATION_FRAME_HEIGHT }}
  >
    <Image source={source} contentFit="contain" style={{ width, height }} />
  </View>
);

export const OnboardingWhatWeDoScreen = () => {
  const router = useRouter();

  const slides = useMemo<PaperOnboardingItemType[]>(
    () => [
      {
        backgroundColor: CANVAS_HONEY,
        icon: IntroBeeIndicator,
        content: () => (
          <WhatWeDoSlide
            illustration={
              <IllustrationFrame
                source={appImages.welcomeBee}
                width={305}
                height={323}
              />
            }
            title="Welcome!"
            body={
              <Text className={BODY_CLASS_NAME}>
                Buzzkeepr™ is your all-in-one platform to help you feel
                confident dating.
              </Text>
            }
          />
        ),
      },
      {
        backgroundColor: CANVAS_LIME,
        icon: ShieldCheck,
        content: () => (
          <WhatWeDoSlide
            illustration={
              <View
                className="items-center justify-center self-stretch"
                style={{ height: ILLUSTRATION_FRAME_HEIGHT }}
              >
                <IllustrationBadge width={209} height={286} />
              </View>
            }
            title="Stand out!"
            body={
              <Text className={BODY_CLASS_NAME}>
                Verify who you are, so your date knows you’re real, invested,
                and worth their time.
              </Text>
            }
          />
        ),
      },
      {
        backgroundColor: CANVAS_HONEY,
        icon: Search,
        content: () => (
          <WhatWeDoSlide
            illustration={
              <IllustrationFrame
                source={appImages.illustrationOnboarding3}
                width={344}
                height={334}
              />
            }
            title="Trust is the new flex!"
            body={
              <Text className={BODY_CLASS_NAME}>
                Get ready for more confidence and more matches.{' '}
              </Text>
            }
            cta={
              <BuzzButton
                label="Let’s go!"
                iconRight={<ArrowRight size={24} color="#FFFFFF" />}
                onPress={() => router.replace('/onboarding/create-account')}
                className="w-[219px] self-center"
              />
            }
          />
        ),
      },
    ],
    [router],
  );

  return (
    <PaperOnboarding
      data={slides}
      safeInsets={{
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
      closeButton={null}
    />
  );
};
