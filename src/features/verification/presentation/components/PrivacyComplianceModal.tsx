import { Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { BaseModal, CompactButton } from '@components';
import { environmentConfig } from '@src/lib/config/environment';

type PrivacyComplianceModalProps = {
  visible: boolean;
  onClose: () => void;
};

const Paragraph = ({ lead, body }: { lead: string; body: string }) => {
  return (
    <Text className="font-lexend-regular text-sm leading-[20px] text-tk-text-primary">
      <Text className="font-lexend-semiBold leading-none">{lead}</Text>
      <Text className="text-tk-text-tertiary"> {body}</Text>
    </Text>
  );
};

export const PrivacyComplianceModal = ({
  visible,
  onClose,
}: PrivacyComplianceModalProps) => {
  const openPrivacyPolicy = () => {
    if (!environmentConfig.privacyPolicyURL) {
      return;
    }
    // Opens an in-app browser sheet (SFSafariViewController on iOS, Custom
    // Tab on Android) instead of kicking the user out to the OS browser.
    void WebBrowser.openBrowserAsync(environmentConfig.privacyPolicyURL);
  };

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      dismissOnBackdropPress
    >
      <View className="gap-4">
        <Text className="font-poppins-semiBold text-title-4 text-tk-text-primary">
          Privacy and Compliance
        </Text>

        <View className="gap-4">
          <Paragraph
            lead="We do not retain any information"
            body="you provide in this screening. It is only used to perform the necessary background check to find your records. Once the screening is complete, your information is not stored."
          />
          <Paragraph
            lead="Your results are strictly confidential!"
            body="To comply with the Fair Credit Reporting Act (FCRA), we will not share any results from this screening with any third parties. While we do keep a record of whether you earned a badge (in binary form), we do not retain detailed screening results."
          />
          <Paragraph
            lead="Sharing your badge or screening results is entirely at your discretion."
            body="You are not required to share your results, and these results should not be used to determine eligibility for access or qualification for any features or services on this platform or on any platform you choose to display your badge on."
          />
          <Text className="font-lexend-regular text-sm leading-[20px] text-tk-text-primary">
            For more information see our{' '}
            <Text
              accessibilityRole="link"
              onPress={openPrivacyPolicy}
              className="text-[#1489E6]"
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>

        <CompactButton
          label="Got it"
          className="mt-4 self-stretch"
          onPress={onClose}
        />
      </View>
    </BaseModal>
  );
};
