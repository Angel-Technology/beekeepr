/**
 * Flow-level story for the consolidated verification screen. Renders the
 * actual `VerificationFlowBody` — the same component the connected
 * `VerificationFlowScreen` mounts in production. No inline preview, no
 * duplicated JSX: the screen is a thin connected wrapper that calls hooks
 * and passes data into the body, so storying the body is equivalent to
 * storying the screen minus the provider-dependent hooks.
 *
 * Use the `phase` control to flip between the six phases of the flow.
 * Press the chevron-left to open the exit-confirm modal; press
 * "More info" on the privacy card to open the privacy modal — both
 * modals are wired with local `useState` inside the body, so they
 * actually toggle in the canvas.
 *
 * See `./VerificationFlowPreview.docs.md` for what each phase corresponds
 * to in the real flow.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { VerificationFlowBody } from '../components/VerificationFlowBody';

const componentNotes = `
# Verification Flow

The same \`VerificationFlowBody\` that runs in production. The connected
\`VerificationFlowScreen\` calls hooks (\`useVerificationFlow\`,
\`useCriminalCheckForm\`, \`useVerificationGate\`, \`useRouter\`) and forwards
the resulting state to this body — Storybook just supplies the props
directly via the controls panel.

## Phases (\`phase\` control)

- \`kickoff\` — Step 1, Persona launch CTA.
- \`waiting\` — bounce loader while polling for the backend webhook.
- \`timed-out\` — ~30s elapsed without resolution.
- \`declined\` — terminal Persona failure with retry.
- \`criminal-intro\` — Step 2 explainer.
- \`criminal-form\` — phone-number form (terminal step).

## Interactive bits

- **Chevron-left** opens the exit-confirm modal (Cancel / Confirm both close it).
- **"More info"** opens the privacy modal (Got it closes it).

The form fields under \`criminal-form\` are not interactive in the canvas —
their values come from the controls panel since the change handler is a
stub. Edit \`phoneNumber\` in the controls to see \`canSubmit\` flip.
`.trim();

const meta = {
  title: 'Verification / Flow',
  component: VerificationFlowBody,
  args: {
    phase: 'kickoff',
    isStarting: false,
    firstName: 'Jane',
    middleName: 'A',
    lastName: 'Smith',
    dateOfBirth: '01/15/1992',
    licenseState: 'CA',
    phoneNumber: '',
    phoneError: undefined,
    isSubmitting: false,
    canSubmit: false,
    // Storybook's action addon replaces these via the `argTypes.action`
    // declarations below — stubs are here to satisfy TS strict-args.
    onExit: () => {},
    onStartVerification: () => {},
    onStartCriminalSearch: () => {},
    onChangePhoneNumber: () => {},
    onValidatePhoneNumber: () => {},
    onSubmit: () => {},
    onStartTrial: () => {},
    onEnterPromoCode: () => {},
    onAppealDecision: () => {},
  },
  argTypes: {
    phase: {
      control: { type: 'select' },
      options: [
        'kickoff',
        'waiting',
        'timed-out',
        'needs-review',
        'declined',
        'criminal-intro',
        'criminal-form',
        'congrats',
        'denied',
      ],
    },
    isStarting: { control: { type: 'boolean' } },
    firstName: { control: { type: 'text' } },
    middleName: { control: { type: 'text' } },
    lastName: { control: { type: 'text' } },
    dateOfBirth: { control: { type: 'text' } },
    licenseState: { control: { type: 'text' } },
    phoneNumber: { control: { type: 'text' } },
    phoneError: { control: { type: 'text' } },
    isSubmitting: { control: { type: 'boolean' } },
    canSubmit: { control: { type: 'boolean' } },
    onExit: { action: 'onExit' },
    onStartVerification: { action: 'onStartVerification' },
    onStartCriminalSearch: { action: 'onStartCriminalSearch' },
    onChangePhoneNumber: { action: 'onChangePhoneNumber' },
    onValidatePhoneNumber: { action: 'onValidatePhoneNumber' },
    onSubmit: { action: 'onSubmit' },
    onStartTrial: { action: 'onStartTrial' },
    onEnterPromoCode: { action: 'onEnterPromoCode' },
    onAppealDecision: { action: 'onAppealDecision' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof VerificationFlowBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kickoff: Story = {
  args: { phase: 'kickoff' },
  parameters: {
    notes: `
## Kickoff

Step 1 of the flow — what the user sees the moment they land on
\`/verify-identity\` after paying. CTA launches Persona.

**Try this:** flip \`isStarting\` to \`true\` to see the loading state.
    `.trim(),
  },
};

export const Waiting: Story = {
  args: { phase: 'waiting' },
  parameters: {
    notes: `
## Waiting

Persona finished on the user's side; we're polling \`currentUser\` for the
backend webhook to land. Bounce loader + reassurance copy.
    `.trim(),
  },
};

export const TimedOut: Story = {
  args: { phase: 'timed-out' },
  parameters: {
    notes: `
## Timed-out

After 15 polls (~30s) without a status change. Soft "we'll email you"
fallback so the user isn't trapped on the spinner. Tapping "Back to home"
fires \`onExit\`.
    `.trim(),
  },
};

export const Declined: Story = {
  args: { phase: 'declined' },
  parameters: {
    notes: `
## Declined

Persona returned a terminal failure (\`Declined\` / \`Failed\` / \`Expired\`).
"Try again" mints a fresh inquiry — same path as the kickoff CTA.

**Try this:** flip \`isStarting\` to \`true\` to see the retry-loading state.
    `.trim(),
  },
};

export const CriminalIntro: Story = {
  args: { phase: 'criminal-intro' },
  parameters: {
    notes: `
## CriminalIntro

Step 2 explainer. Persona has Approved; this is the brief intro before the
form opens. "Start search" flips to the form (no network call).
    `.trim(),
  },
};

export const CriminalForm: Story = {
  args: {
    phase: 'criminal-form',
    phoneNumber: '(555) 123-4567',
    canSubmit: true,
  },
  parameters: {
    notes: `
## CriminalForm

Terminal step. Verified name / DOB / state are read-only; phone is
"editable" in production but driven by the controls panel here. Submit
hits Checkr.

**Try this:** clear \`phoneNumber\` to see \`canSubmit\` go false; flip
\`isSubmitting\` to see the loader on the submit button.
    `.trim(),
  },
};
