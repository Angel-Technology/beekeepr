import { useRouter } from 'expo-router';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { LegalBody } from '../components/LegalBody';

/**
 * Connected wrapper for the Legal hub. Owns the router + `environmentConfig`
 * URL lookup and delegates rendering to `LegalBody`.
 *
 * The drawer used to stack Privacy Policy / Terms of Use / Child Safety
 * Policy inline with every other setting; splitting them into their own
 * screen keeps the drawer scannable and lines up with the platform
 * convention of a dedicated "Legal" surface.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it means the same pixels ship in production and in stories, with no
 * parallel preview composition to keep in sync.
 */
export const LegalScreen = () => {
  const router = useRouter();

  return (
    <LegalBody
      onGoBack={() => router.back()}
      onOpenPrivacyPolicy={() =>
        openInAppBrowser(environmentConfig.privacyPolicyURL)
      }
      onOpenTermsOfUse={() => openInAppBrowser(environmentConfig.termsOfUseURL)}
      onOpenChildSafetyPolicy={() =>
        openInAppBrowser(environmentConfig.childrenPrivacyURL)
      }
    />
  );
};
