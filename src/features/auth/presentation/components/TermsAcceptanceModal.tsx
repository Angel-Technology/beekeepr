import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { BaseModal, CompactButton, CustomCheckbox } from '@components';
import { themedColors, useThemedColor } from '@common';
import { environmentConfig } from '@src/lib/config/environment';

type TermsAcceptanceModalProps = {
  visible: boolean;
  isAccepting?: boolean;
  isDeclining?: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

export const TermsAcceptanceModal = ({
  visible,
  isAccepting = false,
  isDeclining = false,
  onAccept,
  onDecline,
}: TermsAcceptanceModalProps) => {
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isTermsConfirmed, setIsTermsConfirmed] = useState(false);
  const [isPrivacyConfirmed, setIsPrivacyConfirmed] = useState(false);
  const [isCsaeConfirmed, setIsCsaeConfirmed] = useState(false);

  const checkboxColor = useThemedColor(themedColors.text.primary);

  const allConfirmed =
    isAgeConfirmed && isTermsConfirmed && isPrivacyConfirmed && isCsaeConfirmed;

  const legalLinks = useMemo(
    () => ({
      terms: environmentConfig.termsOfUseURL.trim(),
      privacy: environmentConfig.privacyPolicyURL.trim(),
      csae: environmentConfig.childrenPrivacyURL.trim(),
    }),
    [],
  );

  const openLegalLink = (url: string) => {
    void WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
    });
  };

  return (
    <BaseModal
      visible={visible}
      dismissOnBackdropPress={false}
      contentClassName="gap-4 rounded-4"
    >
      <Text className="border-tk-border-secondary text-tk-text-primary border-b pb-4 font-poppins-semiBold text-xl leading-tight">
        User Compliance Agreement
      </Text>

      <Text className="text-tk-text-secondary font-lexend-regular text-sm leading-5">
        Buzzkeepr™ is not a Consumer Reporting Agency (CRA) as defined by the
        Fair Credit Reporting Act (FCRA).{' '}
        <Text className="text-tk-text-primary font-lexend-semiBold">
          The information we provide cannot be used for employment, credit or
          tenant screening, or related purpose.
        </Text>
      </Text>

      <Text className="text-tk-text-secondary font-lexend-regular text-sm leading-5">
        We require age verification to use our services.{' '}
        <Text className="text-tk-text-primary font-lexend-semiBold">
          We strictly prohibit any predatory behavior towards children.
        </Text>
      </Text>

      <View className="gap-4">
        <CustomCheckbox
          checked={isAgeConfirmed}
          onChange={() => setIsAgeConfirmed((current) => !current)}
          checkedFill={checkboxColor}
          uncheckedStroke={checkboxColor}
          label={
            <Text className="text-tk-text-primary font-lexend-regular text-sm leading-5">
              I am 18+ years old
            </Text>
          }
        />

        <CustomCheckbox
          checked={isTermsConfirmed}
          onChange={() => setIsTermsConfirmed((current) => !current)}
          checkedFill={checkboxColor}
          uncheckedStroke={checkboxColor}
          label={
            <Text className="text-tk-text-primary font-lexend-regular text-sm leading-5">
              I have read & agree to the{' '}
              <Text
                className="font-lexend-regular text-sm text-text-informational"
                onPress={() => {
                  openLegalLink(legalLinks.terms);
                }}
              >
                Terms of Use
              </Text>
            </Text>
          }
        />

        <CustomCheckbox
          checked={isPrivacyConfirmed}
          onChange={() => setIsPrivacyConfirmed((current) => !current)}
          checkedFill={checkboxColor}
          uncheckedStroke={checkboxColor}
          label={
            <Text className="text-tk-text-primary font-lexend-regular text-sm leading-5">
              I have read & agree to the{' '}
              <Text
                className="font-lexend-regular text-sm text-text-informational"
                onPress={() => {
                  openLegalLink(legalLinks.privacy);
                }}
              >
                Privacy Policy
              </Text>
            </Text>
          }
        />

        <CustomCheckbox
          checked={isCsaeConfirmed}
          onChange={() => setIsCsaeConfirmed((current) => !current)}
          checkedFill={checkboxColor}
          uncheckedStroke={checkboxColor}
          label={
            <Text className="text-tk-text-primary font-lexend-regular text-sm leading-5">
              I have read & agree to the{' '}
              <Text
                className="font-lexend-regular text-sm text-text-informational"
                onPress={() => {
                  openLegalLink(legalLinks.csae);
                }}
              >
                Child Sexual Abuse &amp; Exploitation (CSAE) Policy
              </Text>
            </Text>
          }
        />
      </View>

      <Text className="text-tk-text-tertiary font-lexend-regular text-footnote leading-[18px]">
        By selecting the boxes above, you&apos;re confirming that you&apos;re at
        least 18 years of age and you&apos;re agreeing to our Terms of Use &amp;
        Privacy Policy.
      </Text>

      <View className="w-full flex-col gap-2 pt-2">
        <CompactButton
          label="I agree & continue"
          disabled={!allConfirmed}
          loading={isAccepting}
          onPress={onAccept}
        />
        <CompactButton
          label="I disagree"
          variant="outline"
          disabled={isDeclining}
          loading={isDeclining}
          onPress={onDecline}
        />
      </View>
    </BaseModal>
  );
};
