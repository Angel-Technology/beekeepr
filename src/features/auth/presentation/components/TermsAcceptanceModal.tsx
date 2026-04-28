import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { BaseModal, CompactButton, CustomCheckbox, Divider } from '@components';
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

  const allConfirmed = isAgeConfirmed && isTermsConfirmed && isPrivacyConfirmed;

  const legalLinks = useMemo(
    () => ({
      terms: environmentConfig.termsOfUseURL.trim(),
      privacy: environmentConfig.privacyPolicyURL.trim(),
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
      contentClassName="gap-5"
    >
      <Text className="font-poppins-semiBold text-600 text-text-default">
        Terms of Use & Privacy Policy
      </Text>

      <Divider />

      <View className="gap-5">
        <Text className="font-sourceSans-regular text-base leading-[22px] text-text-secondary">
          Buzzkeepr is not a Consumer Reporting Agency (CRA) as defined by the
          Fair Credit Reporting Act (FCRA).{' '}
          <Text className="font-sourceSans-semiBold text-text-default">
            The information we provide cannot be used for employment, credit or
            tenant screening, or related purpose.
          </Text>
        </Text>

        <CustomCheckbox
          checked={isAgeConfirmed}
          onChange={() => setIsAgeConfirmed((current) => !current)}
          checkedFill="#000000"
          uncheckedStroke="#000000"
          label="I am 18 years old (or older)"
        />

        <CustomCheckbox
          checked={isTermsConfirmed}
          onChange={() => setIsTermsConfirmed((current) => !current)}
          checkedFill="#000000"
          uncheckedStroke="#000000"
          label={
            <Text className="font-sourceSans-regular text-base leading-[20.8px] text-text-default">
              I have read & agree to the{' '}
              <Text
                className="font-sourceSans-regular text-base text-text-informational underline"
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
          checkedFill="#000000"
          uncheckedStroke="#000000"
          label={
            <Text className="font-sourceSans-regular text-base leading-[20.8px] text-text-default">
              I have read & agree to the{' '}
              <Text
                className="font-sourceSans-regular text-base text-text-informational underline"
                onPress={() => {
                  openLegalLink(legalLinks.privacy);
                }}
              >
                Privacy Policy
              </Text>
            </Text>
          }
        />

        <Text className="font-sourceSans-regular text-200 leading-[16px] text-text-weak">
          By selecting the boxes above, you&apos;re confirming that you&apos;re
          at least 18 years of age and you&apos;re agreeing to our Terms of Use
          & Privacy Policy.
        </Text>
      </View>

      <View className="w-full flex-row gap-2">
        <View className="flex-1">
          <CompactButton
            label="I Disagree"
            variant="outline"
            disabled={isDeclining}
            loading={isDeclining}
            onPress={onDecline}
          />
        </View>
        <View className="flex-1">
          <CompactButton
            label="Agree & Continue"
            disabled={!allConfirmed}
            loading={isAccepting}
            onPress={onAccept}
          />
        </View>
      </View>
    </BaseModal>
  );
};
