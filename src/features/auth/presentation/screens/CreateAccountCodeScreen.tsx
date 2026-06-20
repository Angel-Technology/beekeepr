import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

import {
  BrandMark,
  Button,
  Container,
  OtpInput,
  VerticalSpacer,
} from '@components';
import { useCreateAccountCodeForm } from '../../hooks/useCreateAccountCodeForm';

export const CreateAccountCodeScreen = () => {
  const {
    email,
    code,
    setCode,
    codeLength,
    isComplete,
    isPending,
    handleSubmit,
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
          <VerticalSpacer size="lg" />
          <BrandMark />
          <VerticalSpacer size="lg" />

          <View className="flex-1 gap-6 self-stretch pt-7">
            <View className="gap-4 self-stretch">
              <Text className="text-center font-poppins-semiBold text-2xl text-text-default">
                Enter verification code
              </Text>
              <Text className="text-center font-lexend-regular text-base text-text-default">
                We sent a verification code to your email{' '}
                <Text className="font-lexend-regular">{email}</Text>.
              </Text>
            </View>

            <OtpInput
              value={code}
              onChange={setCode}
              length={codeLength}
              autoFocus
            />
          </View>

          <View className="w-full flex-row gap-2 pb-4 pt-6">
            <View className="flex-1">
              <Button
                label="Go Back"
                variant="outline"
                textClassName="text-action-neutral-text-default"
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
