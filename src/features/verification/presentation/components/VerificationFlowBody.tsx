import { useState } from 'react';
import clsx from 'clsx';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { appAnimations } from '@assets/animations';
import { Container } from '@components';
import type { VerificationPhase } from '../../models/verification.types';
import {
  CongratsSection,
  CriminalFormSection,
  CriminalIntroSection,
  DeniedSection,
  IdentityDeclinedSection,
  IdentityKickoffSection,
  IdentityNeedsReviewSection,
  IdentityTimedOutSection,
  IdentityWaitingSection,
} from '../sections';
import { ExitScreeningModal } from './ExitScreeningModal';
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
  // Congrats-phase trial purchase. `isStartingTrial` drives the button
  // loading state while `useRevenueCat().purchase()` is in flight.
  isStartingTrial: boolean;
  onStartTrial: () => void;
  onEnterPromoCode: () => void;
  // Denied-phase action — wired to a no-op until the appeal flow lands.
  onAppealDecision: () => void;
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
  isStartingTrial,
  onStartTrial,
  onEnterPromoCode,
  onAppealDecision,
}: VerificationFlowBodyProps) => {
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  // Phases with their own sticky bottom UI (e.g. criminal-form's shadow bar)
  // already clear the home indicator — skip the safe-area pad to avoid
  // double-spacing.

  return (
    <View className="flex-1">
      <Container
        safeArea
        safeAreaEdges={['top']}
        className={clsx('bg-tk-bg-primary px-2')}
      >
        <View className="-mx-5 self-stretch">
          <VerificationTopNav
            onPressBack={
              // Congrats / denied are terminal states — chevron-left
              // dismisses straight to home instead of opening the abandon-
              // flow modal.
              phase === 'congrats' || phase === 'denied'
                ? onExit
                : () => setIsExitOpen(true)
            }
          />
        </View>
        <View className="w-full flex-1">
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

          {phase === 'congrats' ? (
            <CongratsSection
              isStartingTrial={isStartingTrial}
              onStartTrial={onStartTrial}
              onEnterPromoCode={onEnterPromoCode}
            />
          ) : null}

          {phase === 'denied' ? (
            <DeniedSection
              onGotIt={onExit}
              onAppealDecision={onAppealDecision}
              onMoreInfo={() => setIsPrivacyOpen(true)}
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

      {phase === 'congrats' ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LottieView
            source={appAnimations.confetti}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}
    </View>
  );
};
