import { useRouter } from 'expo-router';

const NEXT_ROUTE = '/onboarding/create-account';

/**
 * Handler for the "what we do" onboarding carousel. Owns the router hop
 * from the final carousel slide's "Let's go!" CTA into the create-account
 * screen.
 *
 * Responsibilities:
 * - Replace the current route with the create-account entry so the
 *   carousel is dropped from the back stack.
 *
 * The connected screen (`OnboardingWhatWeDoScreen`) wraps this hook and
 * forwards its output into `OnboardingWhatWeDoBody`. Stories render the
 * body directly with a stubbed callback — no router mocks needed.
 */
export const useOnboardingWhatWeDo = () => {
  const router = useRouter();

  return {
    handleFinish: () => {
      router.replace(NEXT_ROUTE);
    },
  };
};
