/**
 * Stories for the onboarding "create account" body. Renders the actual
 * `OnboardingCreateAccountBody` — the same component the connected
 * `OnboardingCreateAccountScreen` mounts in production. No inline
 * preview, no duplicated JSX: the screen is a thin connected wrapper
 * that calls `useOnboardingCreateAccount` and passes data into the body,
 * so storying the body is equivalent to storying the screen minus the
 * router + auth mutation hooks.
 *
 * Tap any of the three CTAs in the canvas — `onContinueWithApple`,
 * `onContinueWithGoogle`, and `onContinueWithEmail` fire into the Actions
 * panel. Toggle `showAppleButton`, `isApplePending`, and `isGooglePending`
 * in the controls panel to preview each state. See
 * `./OnboardingCreateAccountBody.docs.md` for the full anatomy and usage
 * context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { OnboardingCreateAccountBody } from '../components/OnboardingCreateAccountBody';

const componentNotes = `
# OnboardingCreateAccountBody

The social-auth entry point reached from the \`/onboarding/create-account\`
route, sitting between the "what we do" carousel and the app's first
authenticated surface. Renders the brand mark, the "Let's do this"
illustration, and up to three CTAs: Apple (iOS-only), Google, and Email.

## Platform gate

- \`showAppleButton\` — \`useOnboardingCreateAccount\` reads
  \`Platform.OS === 'ios'\` and passes the resulting boolean in. The body
  never checks the platform itself.

## Pending flags (driven by the auth mutations in production)

- \`isApplePending\` — Apple sign-in mutation in flight. Drives the Apple
  button's spinner while the native sheet is open.
- \`isGooglePending\` — Google sign-in mutation in flight. Same shape as
  above for the Google button.

## Callbacks

- \`onContinueWithApple\` — kick off the Apple sign-in mutation.
- \`onContinueWithGoogle\` — kick off the Google sign-in mutation.
- \`onContinueWithEmail\` — route into \`/auth/create-account-email\` for
  the email-code flow.
`.trim();

const meta = {
  title: 'Onboarding / OnboardingCreateAccountBody',
  component: OnboardingCreateAccountBody,
  args: {
    showAppleButton: true,
    isApplePending: false,
    isGooglePending: false,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onContinueWithApple: () => {},
    onContinueWithGoogle: () => {},
    onContinueWithEmail: () => {},
  },
  argTypes: {
    showAppleButton: { control: { type: 'boolean' } },
    isApplePending: { control: { type: 'boolean' } },
    isGooglePending: { control: { type: 'boolean' } },
    onContinueWithApple: { action: 'onContinueWithApple' },
    onContinueWithGoogle: { action: 'onContinueWithGoogle' },
    onContinueWithEmail: { action: 'onContinueWithEmail' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof OnboardingCreateAccountBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default (iOS)

Idle state on iOS. All three CTAs rendered — Apple + Google outlined,
Email solid. This is the shape a user sees on a fresh iPhone landing
after the "what we do" carousel.
    `.trim(),
  },
};

export const AndroidNoApple: Story = {
  args: {
    showAppleButton: false,
  },
  parameters: {
    notes: `
## Android (no Apple)

Idle state on Android. Apple button hidden — Google and Email only. In
production the platform gate lives in \`useOnboardingCreateAccount\`, not
the body.
    `.trim(),
  },
};

export const SubmittingApple: Story = {
  args: {
    isApplePending: true,
  },
  parameters: {
    notes: `
## Submitting — Apple

Native Apple sheet is open. The Apple button shows a spinner via
\`loading\`; the other CTAs stay tappable so the user can back out and
pick a different provider if the sheet stalls.
    `.trim(),
  },
};

export const SubmittingGoogle: Story = {
  args: {
    isGooglePending: true,
  },
  parameters: {
    notes: `
## Submitting — Google

Native Google sheet is open. Same shape as \`SubmittingApple\` but on
the Google button.
    `.trim(),
  },
};
