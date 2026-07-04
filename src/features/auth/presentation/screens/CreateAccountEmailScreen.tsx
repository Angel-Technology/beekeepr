import { useCreateAccountEmailForm } from '../../hooks/useCreateAccountEmailForm';
import { CreateAccountEmailBody } from '../components/CreateAccountEmailBody';

/**
 * Connected wrapper for the "Enter email" account-creation step. Pulls
 * the field state, validation gate, mutation state, and navigation
 * handlers from `useCreateAccountEmailForm`, then passes them into
 * `CreateAccountEmailBody` for rendering.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it from the screen means there's no parallel preview composition to
 * keep in sync — same pixels in production and in stories.
 */
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
    <CreateAccountEmailBody
      email={email}
      canSubmit={canSubmit}
      isPending={isPending}
      shouldShowEmailError={shouldShowEmailError}
      serverError={serverError}
      onChangeEmail={setEmail}
      onValidate={validate}
      onSend={handleSend}
      onGoBack={handleGoBack}
    />
  );
};
