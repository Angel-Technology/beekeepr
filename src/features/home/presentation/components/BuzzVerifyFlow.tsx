import { ArrowRight, FolderX, IdCard, ListX } from 'lucide-react-native';
import { Button, Card, DetailCard, VerificationStatusPill } from '@components';
import { Text, View } from 'react-native';

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
};

const DETAIL_ICON_COLOR = 'rgba(0,0,0,0.7)';

export const BuzzVerifyFlow = ({
  ctaLabel,
  onGetStarted,
  onLearnMore,
}: BuzzVerifyFlowProps) => {
  return (
    <Card className="gap-6 rounded-5 border-secondary">
      <View className="items-center gap-2">
        <Text className="text-center font-poppins-semiBold text-800 text-text-default">
          Join TheBuzz
        </Text>
        <Text className="text-center font-lexend-regular text-xl text-text-default">
          30-Day Free Trial
        </Text>
        <Text className="text-center font-poppins-regular text-base text-text-default">
          $9.99/month
        </Text>
      </View>

      <VerificationStatusPill label="ID verified / No criminal records found" />

      <Text className="text-center font-poppins-regular text-base text-text-default">
        It&apos;s proven that people with visible trust signals get more
        matches.
      </Text>

      <DetailCard
        title="What you’ll show others"
        className="bg-brand-lighter gap-4 rounded-4 p-4"
        titleClassName="font-poppins-semiBold text-base text-text-default"
        itemsClassName="gap-2 pl-0"
        itemTextClassName="font-sourceSans-semiBold text-callout text-text-secondary"
        items={[
          {
            id: 'id-verified',
            label: 'ID Verified',
            icon: <IdCard size={16} color={DETAIL_ICON_COLOR} />,
          },
          {
            id: 'no-violent-crimes',
            label: 'No violent crimes found',
            icon: <FolderX size={16} color={DETAIL_ICON_COLOR} />,
          },
          {
            id: 'not-on-registry',
            label: 'Not on a sex offender registry',
            icon: <ListX size={16} color={DETAIL_ICON_COLOR} />,
          },
        ]}
      />

      <View className="gap-4">
        <Button
          label={ctaLabel}
          iconRight={<ArrowRight color="#FFFFFF" size={24} strokeWidth={2.2} />}
          onPress={onGetStarted}
        />
        {onLearnMore ? (
          <Button label="Learn more" variant="outline" onPress={onLearnMore} />
        ) : null}
      </View>
    </Card>
  );
};
