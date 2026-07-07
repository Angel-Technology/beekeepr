/**
 * Stories for the "30-Day Free Trial" learn-more body. Renders the actual
 * `VerificationLearnMoreBody` — the same component the connected
 * `VerificationLearnMoreScreen` mounts in production. No inline preview,
 * no duplicated JSX: the screen is a thin connected wrapper that calls
 * `useVerificationLearnMore` and passes data into the body, so storying
 * the body is equivalent to storying the screen minus the router hook.
 *
 * Tap the CTA or the X close button in the canvas — `onGetStarted` and
 * `onGoBack` fire into the Actions panel. See
 * `./VerificationLearnMoreBody.docs.md` for the full anatomy and usage
 * context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { VerificationLearnMoreBody } from '../components/VerificationLearnMoreBody';

const componentNotes = `
# VerificationLearnMoreBody

The trial-explainer body reached from the \`/verification/learn-more\`
route. Renders the hero bee, "30-Day Free Trial" title, price copy, the
\`VerificationTrialStepper\` (with the dynamic reminder + trial-end dates),
the "Get started" CTA, and the X close button.

## Dynamic labels (driven by the hook in production)

- \`reminderLabel\` — "In N days" phrasing for when we email the trial
  reminder. \`useVerificationLearnMore\` computes it from the trial length
  minus the reminder lead time (currently \`In 25 days\`).
- \`trialEndLabel\` — long-form date for when the trial ends and billing
  starts. Computed as today + 30 days.

Both labels are shown inside the stepper. Edit the controls to preview
different phrasing.

## Callbacks

- \`onGetStarted\` — advance to \`/verify-identity\` (the Persona kickoff).
- \`onGoBack\` — dismiss the screen (usually back to the paywall or CTA
  that opened it).
`.trim();

const meta = {
  title: 'Verification / VerificationLearnMoreBody',
  component: VerificationLearnMoreBody,
  args: {
    reminderLabel: 'In 25 days',
    trialEndLabel: 'March 22',
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGetStarted: () => {},
    onGoBack: () => {},
  },
  argTypes: {
    reminderLabel: { control: { type: 'text' } },
    trialEndLabel: { control: { type: 'text' } },
    onGetStarted: { action: 'onGetStarted' },
    onGoBack: { action: 'onGoBack' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof VerificationLearnMoreBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reminderLabel: 'March 15',
    trialEndLabel: 'March 22',
  },
  parameters: {
    notes: `
## Default

Idle state. Both dates read as plausible calendar strings — in production
these come from \`useVerificationLearnMore\`, which computes them from the
current date plus the trial-length / reminder-lead constants.

**Try this:** edit \`reminderLabel\` and \`trialEndLabel\` in the controls
panel to preview how the stepper handles different phrasings or longer
date strings.
    `.trim(),
  },
};
