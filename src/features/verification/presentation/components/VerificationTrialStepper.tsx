import { Bell, LockKeyholeOpen } from 'lucide-react-native';
import { Text } from 'react-native';
import { BaseStepper } from '@components';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';

type VerificationTrialStepperProps = {
  reminderLabel: string;
  trialEndLabel: string;
};

export const VerificationTrialStepper = ({
  reminderLabel,
  trialEndLabel,
}: VerificationTrialStepperProps) => {
  return (
    <BaseStepper
      items={[
        {
          key: 'today',
          title: 'Today',
          icon: <LockKeyholeOpen size={16} strokeWidth={3} />,
          description:
            "You'll be charged a one-time, non-refundable application fee of $3.95 to cover processing your application.",
          content: (
            <Text className="font-poppins-semiBold text-300 text-text-default">
              If you pass our screening,
              <Text className="font-poppins-regular text-text-weak">
                {' '}
                your 30-day free trial will begin.
              </Text>
            </Text>
          ),
        },
        {
          key: 'reminder',
          title: reminderLabel,
          icon: <Bell size={16} strokeWidth={3} />,
          description:
            "We'll send you a reminder that your trial is ending soon.",
        },
        {
          key: 'trial-end',
          title: trialEndLabel,
          icon: <IntroBeeIcon width={18} height={18} strokeWidth={3} />,
          description:
            'Trial ends. You will be charged $9.95 unless you cancel before this date.',
        },
      ]}
    />
  );
};
