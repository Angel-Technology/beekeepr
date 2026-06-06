import { Bell, LockKeyholeOpen } from 'lucide-react-native';
import { Text } from 'react-native';
import { BaseStepper } from '@components';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';

type VerificationTrialStepperProps = {
  reminderLabel: string;
  trialEndLabel: string;
};

const titleClassName = 'font-poppins-semiBold text-base text-text-default';
const descriptionClassName =
  'font-poppins-regular text-sm leading-[20px] text-text-tertiary';
const outlineIconWrapperClassName =
  'p-[10px] bg-transparent border border-brand-highlight';
const filledIconWrapperClassName = 'p-[10px] bg-brand-highlight';
const connectorClassName = 'my-0 bg-brand-highlight';

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
          icon: <LockKeyholeOpen size={15} strokeWidth={2.8} color="#000000" />,
          titleClassName,
          descriptionClassName,
          iconWrapperClassName: filledIconWrapperClassName,
          connectorClassName,
          description: 'You pay nothing.',
          content: (
            <Text className="font-poppins-regular text-xs leading-[1.3] text-text-tertiary">
              After you pass our screening, your 30-day free trial begins.
            </Text>
          ),
        },
        {
          key: 'reminder',
          title: reminderLabel,
          icon: <Bell size={15} strokeWidth={2.8} color="#000000" />,
          titleClassName,
          descriptionClassName:
            'font-poppins-medium text-sm leading-[20px] text-text-tertiary',
          iconWrapperClassName: outlineIconWrapperClassName,
          connectorClassName,
          description:
            "We'll send you a reminder that your trial is ending soon.",
        },
        {
          key: 'trial-end',
          title: trialEndLabel,
          icon: <IntroBeeIcon width={15} height={15} />,
          titleClassName,
          descriptionClassName:
            'font-poppins-medium text-sm leading-[20px] text-text-tertiary',
          iconWrapperClassName: outlineIconWrapperClassName,
          description:
            'Trial ends. You will be charged $9.99 unless you cancel before this date.',
        },
      ]}
    />
  );
};
