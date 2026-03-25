import { Image, Text, View } from 'react-native';
import { appImages } from '@assets/images';
import { Button, Card, Container } from '@components';
import { IdentityVerificationStatus } from '@features/auth';
import { useVerifyIdentityScreen } from '../../hooks/useVerifyIdentityScreen';

const verificationChecklist = [
  'Have your driver’s license ready.',
  'Make sure you are in a well-lit space for the selfie capture.',
  'The flow should only take a few minutes.',
];

export const VerifyIdentityScreen = () => {
  const {
    verificationStatus,
    verificationStatusDetails,
    personaInquiryId,
    personaInquiryStatus,
    isPending,
    handlePrimaryAction,
  } = useVerifyIdentityScreen();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="gap-4 bg-bg-default py-4"
    >
      <View className="w-full gap-3">
        <Text className="font-poppins-semiBold text-800 text-text-default">
          Verify your identity
        </Text>
        <Text className="font-sourceSans-regular text-base text-text-secondary">
          We’ll use Persona to collect your driver’s license and a live selfie.
          Your inquiry is now created by the backend and launched from this
          screen.
        </Text>
      </View>

      <Card className="w-full items-center border-border-secondary px-lg py-xl">
        <Image
          source={appImages.verifyBee}
          className="mb-6"
          resizeMode="contain"
          style={{ width: 180, height: 190 }}
        />
        <View className="w-full gap-3">
          {verificationChecklist.map((item) => (
            <Text
              key={item}
              className="font-sourceSans-regular text-base text-text-default"
            >
              {'\u2022'} {item}
            </Text>
          ))}
        </View>
      </Card>

      <Card className="w-full rounded-5 border-border-secondary">
        <Text className="font-sourceSans-semiBold text-base text-text-default">
          {verificationStatusDetails.title}
        </Text>
        <Text className="mt-2 font-sourceSans-regular text-base text-text-secondary">
          {verificationStatusDetails.description}
        </Text>
        <Text className="mt-4 font-sourceSans-regular text-sm text-text-secondary">
          Identity status: {verificationStatus}
        </Text>
        {personaInquiryStatus ? (
          <Text className="mt-1 font-sourceSans-regular text-sm text-text-secondary">
            Persona inquiry status: {personaInquiryStatus}
          </Text>
        ) : null}
        {personaInquiryId ? (
          <Text className="mt-1 font-sourceSans-regular text-sm text-text-secondary">
            Persona inquiry ID: {personaInquiryId}
          </Text>
        ) : null}
      </Card>

      {verificationStatus === IdentityVerificationStatus.Approved ? (
        <Card className="w-full rounded-5 border-border-secondary">
          <Text className="font-sourceSans-semiBold text-base text-text-default">
            Verification complete
          </Text>
          <Text className="mt-2 font-sourceSans-regular text-base text-text-secondary">
            You can go back to the app. This screen will remain available if you
            ever need to inspect the current verification state.
          </Text>
        </Card>
      ) : null}

      <View className="mt-auto w-full flex-row gap-3">
        <Button
          label={verificationStatusDetails.ctaLabel}
          className="flex-1 self-stretch"
          disabled={!verificationStatusDetails.canStart}
          loading={isPending}
          onPress={() => {
            void handlePrimaryAction();
          }}
        />
      </View>
    </Container>
  );
};
