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
  'text-center font-lexend-regular text-base leading-6 text-text-default';
const BODY_TEXT_STYLE = { letterSpacing: -0.3 } as const;

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
              <>
                <Text className={BODY_CLASS_NAME} style={BODY_TEXT_STYLE}>
                  Buzzkeepr™ gives you the tools to verify, protect, and
                  connect.
                </Text>
                <Text className={BODY_CLASS_NAME} style={BODY_TEXT_STYLE}>
                  Your all in one platform for dating safety.
                </Text>
              </>
            }
          />
        ),
      },
      {
        backgroundColor: CANVAS_LIME,
        icon: ShieldCheck,
        content: () => (
          <WhatWeDoSlide
            pillLabel="ID verified / No criminal records found"
            pillIcon={<ShieldCheck size={16} color="#000000" />}
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
              <Text className={BODY_CLASS_NAME} style={BODY_TEXT_STYLE}>
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
                source={appImages.newMatchBee}
                width={236}
                height={293}
              />
            }
            title="New match??"
            body={
              <Text className={BODY_CLASS_NAME} style={BODY_TEXT_STYLE}>
                Search our criminal database for their records with our reverse
                phone lookup.
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
