import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { ArrowRight, FolderX, IdCard, ListX } from 'lucide-react-native';

import {
  Button,
  SafetyDisclaimerCard,
  VerificationStatusPill,
} from '@components';
import { themedColors, useThemedColor } from '@common';
import { appImages } from '@assets/images';
import type { BuzzFlow } from '../../models/buzzFlow.types';

type BuzzVerifyFlowProps = {
  ctaLabel: string;
  onGetStarted: () => void;
  /**
   * When provided, renders the secondary "Learn more" button below the
   * primary CTA. Omitted for users who only need to start a membership —
   * the primary CTA already points at the learn-more screen, so a second
   * button would be redundant.
   */
  onLearnMore?: () => void;
  /**
   * Current Buzz tab flow. The CTA buttons are hidden when flow is
   * 'denied' — the surrounding `BuzzScreeningDeniedCard` owns the
   * "Contact Support" action, so the trial pitch buttons are misleading
   * here.
   */
  flow: BuzzFlow;
};

const TESTIMONIALS: ReadonlyArray<{
  readonly id: string;
  readonly image: number;
  readonly aspectRatio: number;
  readonly quote: string;
}> = [
  {
    id: 'totally-swipe',
    image: appImages.buzzBadgePage1,
    aspectRatio: 313 / 184,
    quote:
      '“I would totally swipe on a guy that had a Buzz Badge over a guy that didn’t.”',
  },
  {
    id: 'decrease-time',
    image: appImages.buzzBadgePage2,
    aspectRatio: 354 / 224,
    quote:
      '“It would decrease the time it would take to decide who to match with.”',
  },
  {
    id: 'serious',
    image: appImages.buzzBadgePage3,
    aspectRatio: 428 / 288,
    quote:
      '“If I saw a guy with this badge, I would automatically think he’s serious about meeting someone. Just think about it. The time and money they invested to help me feel comfortable meeting him… that says a lot!”',
  },
  {
    id: 'character',
    image: appImages.buzzBadgePage4,
    aspectRatio: 345 / 244,
    quote:
      '“If he’s that considerate to proactively go through the process of getting this badge… shows character. Probably, not as likely to ghost either.”',
  },
  {
    id: 'fun-first-date',
    image: appImages.buzzBadgePage5,
    aspectRatio: 366 / 270,
    quote:
      '“We could go back to having fun on a first date, instead of it feeling awkward, like an interview.”',
  },
  {
    id: 'safety-children',
    image: appImages.buzzBadgePage6,
    aspectRatio: 371 / 198,
    quote:
      '“Online dating is difficult because I have young children, so I have to take safety very seriously. This would help me feel way more comfortable meeting new people.”',
  },
];

const REPRESENTS_ITEMS = [
  { id: 'gov-id', label: 'Verified Gov ID and identity', Icon: IdCard },
  { id: 'no-violent', label: 'No violent crimes were found', Icon: FolderX },
  {
    id: 'no-registry',
    label: 'You’re not on a sex offender registry',
    Icon: ListX,
  },
] as const;

const CtaButtons = ({
  ctaLabel,
  onGetStarted,
  onLearnMore,
}: {
  ctaLabel: string;
  onGetStarted: () => void;
  onLearnMore?: () => void;
}) => {
  const arrowColor = useThemedColor(themedColors.text.primaryReversed);
  return (
    <View className="w-full gap-4">
      <Button
        label={ctaLabel}
        iconRight={
          <ArrowRight color={arrowColor} size={24} strokeWidth={2.2} />
        }
        onPress={onGetStarted}
      />
      {onLearnMore ? (
        <Button label="Learn more" variant="outline" onPress={onLearnMore} />
      ) : null}
    </View>
  );
};

export const BuzzVerifyFlow = ({
  ctaLabel,
  onGetStarted,
  onLearnMore,
  flow,
}: BuzzVerifyFlowProps) => {
  const representsIconColor = useThemedColor(themedColors.text.secondary);
  const showCta = flow !== 'denied';

  return (
    <View className="w-full gap-8">
      <View className="w-full items-center gap-4">
        <VerificationStatusPill
          label="ID verified / No criminal records found"
          size="sm"
          className="bg-tk-brand-primary"
        />
        <Text className="text-tk-text-primary text-center font-poppins-semiBold text-title-2 leading-[1.2]">
          Stand out!
        </Text>
        <Image
          source={appImages.standoutBee}
          contentFit="contain"
          style={{ width: 180, height: 263 }}
        />
        <View className="w-full items-center gap-2">
          <Text className="text-tk-text-primary text-center font-lexend-regular text-title-4">
            30-Day Free Trial
          </Text>
          <Text className="text-tk-text-primary text-center font-poppins-regular text-base">
            $9.99/month
          </Text>
        </View>
      </View>

      {showCta ? (
        <CtaButtons
          ctaLabel={ctaLabel}
          onGetStarted={onGetStarted}
          onLearnMore={onLearnMore}
        />
      ) : null}

      {/* The Buzz Badge represents */}
      <View className="bg-tk-bg-callout w-full gap-4 rounded-4 p-4">
        <Text className="text-tk-text-primary font-poppins-semiBold text-base leading-[1.25]">
          The Buzz Badge represents:
        </Text>
        <View className="w-full gap-2">
          {REPRESENTS_ITEMS.map(({ id, label, Icon }) => (
            <View key={id} className="w-full flex-row items-center gap-3">
              <Icon size={16} color={representsIconColor} />
              <Text className="text-tk-text-secondary flex-1 font-sourceSans-semiBold text-callout leading-[1.3]">
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View className="w-full gap-4">
        <Text className="text-tk-text-primary font-lexend-semiBold text-base leading-6">
          We interviewed over 100 women and this is what they had to say:
        </Text>
        {TESTIMONIALS.map(({ id, image, aspectRatio, quote }) => (
          <View key={id} className="w-full gap-4">
            <Image
              source={image}
              contentFit="cover"
              style={{
                width: '100%',
                aspectRatio,
              }}
            />
            <Text
              className="text-tk-text-secondary font-lexend-regular text-base leading-6"
              style={{ letterSpacing: -0.3 }}
            >
              {quote}
            </Text>
          </View>
        ))}
      </View>

      {showCta ? (
        <CtaButtons
          ctaLabel={ctaLabel}
          onGetStarted={onGetStarted}
          onLearnMore={onLearnMore}
        />
      ) : null}

      <SafetyDisclaimerCard />
    </View>
  );
};
