import { Bell, LockKeyholeOpen } from 'lucide-react-native';
import { Text } from 'react-native';
import { BaseStepper } from '@components';
import { themedColors, useThemedColor } from '@common';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';

type VerificationTrialStepperProps = {
  reminderLabel: string;
  trialEndLabel: string;
};

const titleClassName = 'font-poppins-semiBold text-base text-tk-text-primary';
const descriptionClassName =
  'font-poppins-regular text-sm leading-[20px] text-tk-text-tertiary';
const outlineIconWrapperClassName =
  'p-[10px] bg-transparent border-2 border-brand-primary';
const filledIconWrapperClassName =
  'p-[10px] bg-brand-primary border-2 border-brand-primary';
const connectorClassName = 'my-0 bg-brand-primary';

export const VerificationTrialStepper = ({
  reminderLabel,
  trialEndLabel,
}: VerificationTrialStepperProps) => {
  const filledIconColor = useThemedColor(themedColors.gray.black);
  const outlineIconColor = useThemedColor(themedColors.text.primary);

  return (
    <BaseStepper
      itemClassName="gap-4"
      contentClassName="gap-2"
      items={[
        {
          key: 'today',
          title: 'Today',
          icon: (
            <LockKeyholeOpen
              size={15}
              strokeWidth={2.8}
              color={filledIconColor}
            />
          ),
          titleClassName,
          descriptionClassName,
          iconWrapperClassName: filledIconWrapperClassName,
          connectorClassName,
          description: 'You pay nothing.',
          content: (
            <Text className="font-poppins-regular text-xs leading-[1.3] text-tk-text-tertiary">
              After you pass our screening, your 30-day free trial begins.
            </Text>
          ),
        },
        {
          key: 'reminder',
          title: reminderLabel,
          icon: <Bell size={15} strokeWidth={2.8} color={outlineIconColor} />,
          titleClassName,
          descriptionClassName:
            'font-poppins-medium text-sm leading-[20px] text-tk-text-tertiary',
          iconWrapperClassName: outlineIconWrapperClassName,
          connectorClassName,
          description:
            "We'll send you a reminder that your trial is ending soon.",
        },
        {
          key: 'trial-end',
          title: trialEndLabel,
          icon: (
            <IntroBeeIcon width={15} height={15} color={outlineIconColor} />
          ),
          titleClassName,
          descriptionClassName:
            'font-poppins-medium text-sm leading-[20px] text-tk-text-tertiary',
          iconWrapperClassName: outlineIconWrapperClassName,
          description:
            'Trial ends. You will be charged $9.99 unless you cancel before this date.',
        },
      ]}
    />
  );
};
