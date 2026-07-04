import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

import {
  BrandMark,
  Button,
  Container,
  FormCard,
  Input,
  VerticalSpacer,
} from '@components';

type CreateAccountEmailBodyProps = {
  /** Current text-input value. Controlled by the parent via `onChangeEmail`. */
  email: string;
  /**
   * Whether the "Send" CTA is enabled. In production this is
   * `trimmedEmail.length > 0 && isValidEmail` from
   * `useCreateAccountEmailForm`.
   */
  canSubmit: boolean;
  /** True while the `requestEmailSignIn` mutation is in flight. */
  isPending: boolean;
  /**
   * Whether to render the inline validation error under the field. The hook
   * only flips this on after the user has interacted (blur / submit) so the
   * screen stays quiet on first paint.
   */
  shouldShowEmailError: boolean;
  /**
   * Server-side error message from the OTP-request mutation, or `null` when
   * the mutation hasn't failed. Rendered below the form as a red inline
   * string.
   */
  serverError: string | null;
  onChangeEmail: (next: string) => void;
  /** Fires on blur and submit-editing — the hook uses it to arm validation. */
  onValidate: () => void;
  onSend: () => void;
  onGoBack: () => void;
};

/**
 * Pure presentation layer for the "Enter email" step of account creation.
 * Renders the brand mark, the explainer copy, the single email `Input`
 * inside a `FormCard`, a server-error line, and the Go Back + Send button
 * row.
 *
 * Reads no feature hooks — validation state, mutation state, and the
 * router live in `useCreateAccountEmailForm` inside
 * `CreateAccountEmailScreen`. Stories render this body directly with
 * stubs, so no provider or router mocks are required.
 */
export const CreateAccountEmailBody = ({
  email,
  canSubmit,
  isPending,
  shouldShowEmailError,
  serverError,
  onChangeEmail,
  onValidate,
  onSend,
  onGoBack,
}: CreateAccountEmailBodyProps) => {
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
                onChangeText={onChangeEmail}
                error={
                  shouldShowEmailError
                    ? 'Please enter a valid email address.'
                    : undefined
                }
                onBlur={onValidate}
                onSubmitEditing={onValidate}
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
                onPress={onGoBack}
                textClassName="text-tk-actions-neutral-text-default"
              />
            </View>
            <View className="flex-1">
              <Button
                label="Send"
                disabled={!canSubmit}
                loading={isPending}
                onPress={onSend}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};
