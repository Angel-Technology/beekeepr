import { useRouter } from 'expo-router';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { useCriminalCheckForm } from '../../hooks/useCriminalCheckForm';
import { useTrialPurchase } from '../../hooks/useTrialPurchase';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useVerificationGate } from '../../hooks/useVerificationGate';
import { VerificationFlowBody } from '../components/VerificationFlowBody';

const HOME_ROUTE = '/(main)';

/**
 * Connected wrapper for the consolidated verification flow. Pulls phase +
 * action handlers from `useVerificationFlow`, form state from
 * `useCriminalCheckForm`, and gates the screen on `subscription` — then
 * passes everything to `VerificationFlowBody` for rendering.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it from the screen means there's no parallel preview composition to
 * keep in sync — same pixels in production and in stories.
 *
 * The chevron-left in the header opens the exit-confirm modal owned by
 * the body; programmatic navigation (Persona retry, gate redirect,
 * post-submit `router.replace('/(main)')` from the form hook) passes
 * through without prompting. This is the deliberate trade-off vs.
 * `usePreventRemove`: we no longer guard hardware back / swipe gestures,
 * but the modal is also never accidentally triggered by our own
 * navigation.
 */
export const VerificationFlowScreen = () => {
  const router = useRouter();
  const flow = useVerificationFlow();
  const form = useCriminalCheckForm();
  const trial = useTrialPurchase();

  useVerificationGate();

  return (
    <VerificationFlowBody
      phase={flow.phase}
      isStarting={flow.isStarting}
      onExit={() => router.replace(HOME_ROUTE)}
      onStartVerification={() => {
        void flow.handleStartVerification();
      }}
      onStartCriminalSearch={flow.handleStartCriminalSearch}
      firstName={form.firstName}
      middleName={form.middleName}
      lastName={form.lastName}
      dateOfBirth={form.dateOfBirth}
      licenseState={form.licenseState}
      phoneNumber={form.phoneNumber}
      phoneError={form.phoneError}
      isSubmitting={form.isSubmitting}
      canSubmit={form.canSubmit}
      onChangePhoneNumber={form.setPhoneNumber}
      onValidatePhoneNumber={form.validatePhoneNumber}
      onSubmit={() => {
        void form.handleSubmit();
      }}
      isStartingTrial={trial.isPurchasing}
      onStartTrial={() => {
        void trial.startTrial();
      }}
      // TODO: wire promo-code redemption when the offer set is finalised.
      onEnterPromoCode={() => {}}
      onAppealDecision={() =>
        openInAppBrowser(environmentConfig.supportURL)
      }
    />
  );
};
