import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

import {
  BrandMark,
  Button,
  Container,
  FormCard,
  Input,
  VerticalSpacer,
} from '@components';
import { useCreateAccountEmailForm } from '../../hooks/useCreateAccountEmailForm';

export const CreateAccountEmailScreen = () => {
  const {
    email,
    setEmail,
    canSubmit,
    isPending,
    shouldShowEmailError,
    serverError,
    validate,
    handleSend,
    handleGoBack,
  } = useCreateAccountEmailForm();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-tk-bg-primary flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 self-stretch">
          <VerticalSpacer size="lg" />
          <BrandMark />
          <VerticalSpacer size="2xl" />

          <View className="flex-1 justify-start gap-7 self-stretch ">
            <View className="gap-4 self-stretch">
              <Text className="text-tk-text-primary text-center font-poppins-semiBold text-2xl">
                Enter email
              </Text>
              <Text
                className="text-tk-text-primary text-center font-lexend-regular text-base"
                style={{ letterSpacing: -0.3 }}
              >
                We’ll send you a{' '}
                <Text className="font-lexend-semiBold">
                  One Time Verification Code
                </Text>{' '}
                via this email address.
              </Text>
            </View>

            <FormCard>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@website.com"
                value={email}
                onChangeText={setEmail}
                error={
                  shouldShowEmailError
                    ? 'Please enter a valid email address.'
                    : undefined
                }
                onBlur={validate}
                onSubmitEditing={validate}
              />
            </FormCard>

            {serverError ? (
              <Text className="text-tk-alerts-danger font-lexend-regular text-sm">
                {serverError}
              </Text>
            ) : null}
          </View>

          <View className="w-full flex-row gap-2 pb-4">
            <View className="flex-1">
              <Button
                label="Go Back"
                variant="outline"
                onPress={handleGoBack}
                textClassName="text-tk-actions-neutral-text-default"
              />
            </View>
            <View className="flex-1">
              <Button
                label="Send"
                disabled={!canSubmit}
                loading={isPending}
                onPress={handleSend}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};
