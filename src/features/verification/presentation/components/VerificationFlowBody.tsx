import { useState } from 'react';
import { View } from 'react-native';
import { Container } from '@components';
import type { VerificationPhase } from '../../models/verification.types';
import { CriminalFormSection } from './CriminalFormSection';
import { CriminalIntroSection } from './CriminalIntroSection';
import { ExitScreeningModal } from './ExitScreeningModal';
import { IdentityDeclinedSection } from './IdentityDeclinedSection';
import { IdentityKickoffSection } from './IdentityKickoffSection';
import { IdentityNeedsReviewSection } from './IdentityNeedsReviewSection';
import { IdentityTimedOutSection } from './IdentityTimedOutSection';
import { IdentityWaitingSection } from './IdentityWaitingSection';
import { PrivacyComplianceModal } from './PrivacyComplianceModal';
import { VerificationTopNav } from './VerificationTopNav';

type VerificationFlowBodyProps = {
  phase: VerificationPhase;
  isStarting: boolean;
  /**
   * Confirmed exit — fired when the user taps "Yes, exit" in the modal.
   * The body owns the modal state internally; the parent owns the
   * actual navigation (`router.replace('/(main)')`) so this component
   * stays free of router dependencies and is storyable.
   */
  onExit: () => void;
  onStartVerification: () => void;
  onStartCriminalSearch: () => void;
  // Criminal-form phase props — unused by other phases but kept on the
  // outer prop type so the connected screen can pass form state through
  // and stories can drive form fields via controls.
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  licenseState: string;
  phoneNumber: string;
  phoneError?: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onChangePhoneNumber: (value: string) => void;
  onValidatePhoneNumber: () => void;
  onSubmit: () => void;
};

/**
 * Pure presentation layer for the consolidated verification flow. Owns
 * only:
 *
 * - Local modal state (`isExitOpen`, `isPrivacyOpen`) — these are render
 *   concerns, not data concerns, so they live with the JSX.
 * - The phase → section dispatch.
 *
 * Reads no hooks beyond `useState`. The connected screen
 * (`VerificationFlowScreen`) wraps this with `useVerificationFlow`,
 * `useCriminalCheckForm`, `useVerificationGate`, and `useRouter`, then
 * passes data + handlers in. Stories render this body directly with stubs
 * — no provider mocks needed.
 */
export const VerificationFlowBody = ({
  phase,
  isStarting,
  onExit,
  onStartVerification,
  onStartCriminalSearch,
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  licenseState,
  phoneNumber,
  phoneError,
  isSubmitting,
  canSubmit,
  onChangePhoneNumber,
  onValidatePhoneNumber,
  onSubmit,
}: VerificationFlowBodyProps) => {
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-bg-default px-2"
    >
      <View className="-mx-5 self-stretch">
        <VerificationTopNav onPressBack={() => setIsExitOpen(true)} />
      </View>
      <View className="w-full flex-1 pb-4">
        {phase === 'kickoff' ? (
          <IdentityKickoffSection
            isStarting={isStarting}
            onStart={onStartVerification}
            onMoreInfo={() => setIsPrivacyOpen(true)}
          />
        ) : null}

        {phase === 'waiting' ? <IdentityWaitingSection /> : null}

        {phase === 'timed-out' ? (
          <IdentityTimedOutSection onGoHome={onExit} />
        ) : null}

        {phase === 'needs-review' ? (
          <IdentityNeedsReviewSection onGoHome={onExit} />
        ) : null}

        {phase === 'declined' ? (
          <IdentityDeclinedSection
            isStarting={isStarting}
            onRetry={onStartVerification}
          />
        ) : null}

        {phase === 'criminal-intro' ? (
          <CriminalIntroSection
            onStartSearch={onStartCriminalSearch}
            onMoreInfo={() => setIsPrivacyOpen(true)}
          />
        ) : null}

        {phase === 'criminal-form' ? (
          <CriminalFormSection
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
            dateOfBirth={dateOfBirth}
            licenseState={licenseState}
            phoneNumber={phoneNumber}
            phoneError={phoneError}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            onChangePhoneNumber={onChangePhoneNumber}
            onValidatePhoneNumber={onValidatePhoneNumber}
            onSubmit={onSubmit}
          />
        ) : null}
      </View>

      <PrivacyComplianceModal
        visible={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <ExitScreeningModal
        visible={isExitOpen}
        onCancel={() => setIsExitOpen(false)}
        onConfirmExit={() => {
          setIsExitOpen(false);
          onExit();
        }}
      />
    </Container>
  );
};
