import { useCreateAccountCodeForm } from '../../hooks/useCreateAccountCodeForm';
import { CreateAccountCodeBody } from '../components/CreateAccountCodeBody';

/**
 * Connected wrapper for the "Enter verification code" account-creation
 * step. Pulls the OTP field state, completion gate, mutation state, and
 * navigation handlers from `useCreateAccountCodeForm`, then passes them
 * into `CreateAccountCodeBody` for rendering.
 *
 * Renders nothing while the hook is still resolving the `email` route
 * param — the hook redirects back to the email step in that case.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it from the screen means there's no parallel preview composition to
 * keep in sync — same pixels in production and in stories.
 */
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
    <CreateAccountCodeBody
      email={email}
      code={code}
      codeLength={codeLength}
      isComplete={isComplete}
      isPending={isPending}
      onChangeCode={setCode}
      onSubmit={() => {
        void handleSubmit();
      }}
      onGoBack={handleGoBack}
    />
  );
};
