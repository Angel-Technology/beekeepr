import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

import {
  BrandMark,
  Button,
  Container,
  OtpInput,
  VerticalSpacer,
} from '@components';

type CreateAccountCodeBodyProps = {
  /**
   * The trimmed email the code was sent to. Rendered inline in the copy so
   * the user can confirm they typed it correctly on the prior step.
   */
  email: string;
  /** Current OTP value. Controlled by the parent via `onChangeCode`. */
  code: string;
  /**
   * Number of digits the OTP input should render. In production this is
   * fixed at 5 by `useCreateAccountCodeForm`; taking it as a prop keeps the
   * body agnostic to that constant.
   */
  codeLength: number;
  /** True when `code.length === codeLength`. Gates the Submit CTA. */
  isComplete: boolean;
  /** True while the `verifyEmailSignIn` mutation is in flight. */
  isPending: boolean;
  onChangeCode: (next: string) => void;
  onSubmit: () => void;
  onGoBack: () => void;
};

/**
 * Pure presentation layer for the "Enter verification code" step of
 * account creation. Renders the brand mark, explainer copy showing the
 * email the code was sent to, the `OtpInput`, and the Go Back + Submit
 * button row.
 *
 * Reads no feature hooks — the OTP verification mutation, the auto-submit
 * effect, the resend flow, and the router live in
 * `useCreateAccountCodeForm` inside `CreateAccountCodeScreen`. Stories
 * render this body directly with stubs, so no provider or router mocks
 * are required.
 */
export const CreateAccountCodeBody = ({
  email,
  code,
  codeLength,
  isComplete,
  isPending,
  onChangeCode,
  onSubmit,
  onGoBack,
}: CreateAccountCodeBodyProps) => {
  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="flex-1 bg-tk-bg-primary"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 self-stretch">
          <VerticalSpacer size="lg" />
          <BrandMark />
          <VerticalSpacer size="lg" />

          <View className="flex-1 gap-6 self-stretch pt-7">
            <View className="gap-4 self-stretch">
              <Text className="text-center font-poppins-semiBold text-2xl text-tk-text-primary">
                Enter verification code
              </Text>
              <Text className="text-center font-lexend-regular text-base text-tk-text-primary">
                We sent a verification code to your email{' '}
                <Text className="font-lexend-regular">{email}</Text>.
              </Text>
            </View>

            <OtpInput
              value={code}
              onChange={onChangeCode}
              length={codeLength}
              autoFocus
            />
          </View>

          <View className="w-full flex-row gap-2 pb-4 pt-6">
            <View className="flex-1">
              <Button
                label="Go Back"
                variant="outline"
                textClassName="text-tk-actions-neutral-text-default"
                onPress={onGoBack}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Submit"
                disabled={!isComplete}
                loading={isPending}
                onPress={onSubmit}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};
