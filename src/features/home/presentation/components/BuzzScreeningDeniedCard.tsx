import { NextStepsCard } from '@features/verification/presentation/components/NextStepsCard';

type BuzzScreeningDeniedCardProps = {
  onAppealDecision: () => void;
};

const DENIED_LEAD = 'We’re sorry, you did not pass the Buzz Badge screening.';

const DENIED_PARAGRAPHS = [
  'Your application was not approved based, in part, on the results of your background screening.',
  'If you feel this is in error, please contact support to resolve this decision.',
  'You have 30 days to appeal from the time your application was denied.',
] as const;

/**
 * Buzz-tab denial summary. Thin wrapper around `NextStepsCard` with the
 * Buzz-flavored copy (bold lead + denial paragraphs). The wrapping screen
 * pairs this with `BuzzVerifyFlow` so the Stand-Out hero + testimonials
 * still show below.
 */
export const BuzzScreeningDeniedCard = ({
  onAppealDecision,
}: BuzzScreeningDeniedCardProps) => (
  <NextStepsCard
    lead={DENIED_LEAD}
    paragraphs={DENIED_PARAGRAPHS}
    onPressAppeal={onAppealDecision}
  />
);
