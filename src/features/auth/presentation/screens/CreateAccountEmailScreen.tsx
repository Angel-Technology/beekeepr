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
      className="flex-1 bg-bg-default"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 self-stretch">
          <VerticalSpacer size="lg" />
          <BrandMark />
          <VerticalSpacer size="2xl" />

          <View className="flex-1 justify-start gap-7 self-stretch ">
            <View className="gap-4 self-stretch">
              <Text className="text-center font-poppins-semiBold text-2xl text-text-default">
                Enter email
              </Text>
              <Text
                className="text-center font-lexend-regular text-base text-text-default"
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
              <Text className="font-lexend-regular text-sm text-text-critical">
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
                textClassName="text-action-neutral-text-default"
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
