import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button, Container, FormCard, OtpInput } from '@components';
import { useCreateAccountCodeForm } from '../../hooks/useCreateAccountCodeForm';
import { AuthBrandHeader } from '../components/AuthBrandHeader';

export const CreateAccountCodeScreen = () => {
  const {
    email,
    code,
    setCode,
    codeLength,
    isComplete,
    isPending,
    isResending,
    handleSubmit,
    handleResend,
    handleGoBack,
  } = useCreateAccountCodeForm();

  if (!email) {
    return null;
  }

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="flex-1 bg-bg-default"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 self-stretch">
          <AuthBrandHeader />

          <View className="flex-1 gap-6 self-stretch pt-7">
            <View className="gap-4 self-stretch">
              <Text className="text-center font-poppins-semiBold text-2xl leading-tight text-text-default">
                Enter verification code
              </Text>
              <Text
                className="text-center font-lexend-regular text-base leading-6 text-text-default"
                // style={{ letterSpacing: -0.3 }}
              >
                We sent a verification code to your email{' '}
                <Text className="font-lexend-regular">{email}</Text>.
              </Text>
            </View>

            <FormCard className="py-6">
              <OtpInput
                value={code}
                onChange={setCode}
                length={codeLength}
                autoFocus
              />
            </FormCard>

            <TouchableOpacity
              accessibilityRole="button"
              disabled={isResending}
              onPress={() => {
                void handleResend();
              }}
              className="self-center"
            >
              <Text className="font-lexend-semiBold text-base text-text-default underline">
                {isResending ? 'Sending…' : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row gap-2 pb-4 pt-6">
            <View className="flex-1">
              <Button
                label="Go Back"
                variant="outline"
                onPress={handleGoBack}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Submit"
                disabled={!isComplete}
                loading={isPending}
                onPress={() => {
                  void handleSubmit();
                }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};
