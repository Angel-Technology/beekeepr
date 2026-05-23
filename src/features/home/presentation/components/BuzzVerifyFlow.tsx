import { ArrowRight, FolderX, IdCard, ReceiptText } from 'lucide-react-native';
import { Button, Card, DetailCard, VerificationStatusPill } from '@components';
import { Text, View } from 'react-native';

type BuzzVerifyFlowProps = {
  ctaLabel: string;
  onGetStarted: () => void;
};

export const BuzzVerifyFlow = ({
  ctaLabel,
  onGetStarted,
}: BuzzVerifyFlowProps) => {
  return (
    <Card className="gap-6 rounded-5 border-secondary">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text className="text-center font-poppins-semiBold text-800 text-text-default">
            Join TheBuzz
          </Text>
          <Text className="text-center font-poppins-regular text-xl text-text-default">
            30-day Free Trial
          </Text>
          <Text className="text-center font-poppins-regular text-base text-text-default">
            $9.95/month
          </Text>
        </View>
      </View>

      <VerificationStatusPill label="ID verified / No criminal records found" />

      <Text className="text-center font-poppins-regular text-400 text-text-default">
        It&apos;s proven that people with visible trust signals get more
        matches.
      </Text>

      <DetailCard
        title="What you’ll show others"
        className="gap-5 rounded-5 px-5 py-5"
        titleClassName="font-poppins-semiBold text-base text-text-default"
        itemsClassName="gap-3 pl-0"
        itemTextClassName="font-poppins-regular text-sm text-text-secondary"
        items={[
          {
            id: 'id-verified',
            label: 'ID Verified',
            icon: <IdCard size={14} color="#111111" />,
          },
          {
            id: 'no-violent-crimes',
            label: 'No violent crimes found',
            icon: <FolderX size={14} color="#111111" />,
          },
          {
            id: 'not-on-registry',
            label: 'Not on a sex offender registry',
            icon: <ReceiptText size={14} color="#111111" />,
          },
        ]}
      />

      <Button
        label={ctaLabel}
        iconRight={<ArrowRight color="#FFFFFF" size={24} strokeWidth={2.2} />}
        onPress={onGetStarted}
      />
    </Card>
  );
};
