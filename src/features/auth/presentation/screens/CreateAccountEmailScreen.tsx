import { Text, View } from 'react-native';

import { Button, Container, FloatingLabelInput } from '@components';
import { useCreateAccountEmailForm } from '@features/auth';
import { AuthBrandHeader } from '../components/AuthBrandHeader';

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
      className="gap-8 self-stretch bg-bg-default p-0"
    >
      <AuthBrandHeader />

      <View className="flex flex-col items-start gap-7 self-stretch">
        <View className=" w-full gap-2">
          <Text className="font-poppins-semiBold text-700 text-text-default">
            Enter your Email Address
          </Text>
          <Text className="font-sourceSans-regular text-base text-text-secondary">
            We will send you a{' '}
            <Text className="font-sourceSans-semiBold text-text-default">
              One Time Verification Code
            </Text>{' '}
            via this email address.
          </Text>
        </View>

        <View className="flex flex-col items-start gap-6 self-stretch rounded-5 border border-border-secondary p-lg">
          <FloatingLabelInput
            id="create-account-email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            isValid={!shouldShowEmailError}
            errorText="Please enter a valid email address."
            onBlur={validate}
            onSubmitEditing={validate}
          />
        </View>

        {serverError ? (
          <Text className="font-sourceSans-regular text-200 text-text-critical">
            {serverError}
          </Text>
        ) : null}
      </View>

      <View className="mt-auto w-full flex-row gap-3 pb-4">
        <View className="flex-1">
          <Button
            label="Go Back"
            variant="outline"
            className="self-stretch"
            textClassName="text-text-secondary"
            onPress={handleGoBack}
          />
        </View>
        <View className="flex-1">
          <Button
            label="Send"
            className="self-stretch"
            disabled={!canSubmit}
            loading={isPending}
            onPress={handleSend}
          />
        </View>
      </View>
    </Container>
  );
};
