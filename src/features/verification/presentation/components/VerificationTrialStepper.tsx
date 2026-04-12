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
      itemClassName="gap-4"
      contentClassName="gap-2"
      items={[
        {
          key: 'today',
          title: 'Today',
          icon: <LockKeyholeOpen size={15} strokeWidth={2.8} />,
          titleClassName: 'font-poppins-semiBold text-base text-text-default',
          descriptionClassName:
            'font-poppins-regular text-sm leading-[20px] text-text-weak',
          iconWrapperClassName: 'p-[10px]',
          connectorClassName: 'my-0 bg-brand-primary',
          description: 'You pay nothing to start.',
          content: (
            <Text className="font-poppins-regular text-sm leading-[20px] text-text-weak">
              Your 7-day free trial will begin, after you pass our screening.
            </Text>
          ),
        },
        {
          key: 'reminder',
          title: reminderLabel,
          icon: <Bell size={15} strokeWidth={2.8} />,
          titleClassName: 'font-poppins-semiBold text-base text-text-default',
          descriptionClassName:
            'font-poppins-regular text-sm leading-[20px] text-text-weak',
          iconWrapperClassName: 'p-[10px]',
          connectorClassName: 'my-0 bg-brand-primary',
          description:
            "We'll send you a reminder that your trial is ending soon.",
        },
        {
          key: 'trial-end',
          title: trialEndLabel,
          icon: <IntroBeeIcon width={15} height={15} />,
          titleClassName: 'font-poppins-semiBold text-base text-text-default',
          descriptionClassName:
            'font-poppins-regular text-sm leading-[20px] text-text-weak',
          iconWrapperClassName: 'p-[10px]',
          description:
            'Trial ends. You will be charged $9.95 unless you cancel before this date.',
        },
      ]}
    />
  );
};
