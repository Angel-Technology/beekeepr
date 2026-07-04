/**
 * Stories for the "Enter verification code" account-creation body.
 * Renders the actual `CreateAccountCodeBody` — the same component the
 * connected `CreateAccountCodeScreen` mounts in production. No inline
 * preview, no duplicated JSX: the screen is a thin connected wrapper
 * that calls `useCreateAccountCodeForm` and passes data into the body,
 * so storying the body is equivalent to storying the screen minus the
 * router hook.
 *
 * Type in the OTP field or tap the buttons in the canvas —
 * `onChangeCode`, `onSubmit`, and `onGoBack` fire into the Actions
 * panel. See `./CreateAccountCodeBody.docs.md` for the full anatomy and
 * usage context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { CreateAccountCodeBody } from '../components/CreateAccountCodeBody';

const componentNotes = `
# CreateAccountCodeBody

The OTP-entry body reached from the \`/auth/create-account-code\` route.
Renders the brand mark, "Enter verification code" title, explainer copy
showing the email the code was sent to, the \`OtpInput\`, and the Go
Back + Submit button row.

## States driven by the hook

- \`isComplete\` — \`code.length === codeLength\`. Gates the Submit
  CTA and drives the hook's auto-submit effect.
- \`isPending\` — the \`verifyEmailSignIn\` mutation is in flight; the
  Submit button shows a loader.

## Callbacks

- \`onChangeCode\` — OTP input change. The hook auto-submits once the
  code becomes complete, so tapping Submit is only needed if the user
  edits after an auto-submit failure.
- \`onSubmit\` — tap the Submit CTA. Parent runs the mutation and, on
  success, the auth session advances the app past the login gate.
- \`onGoBack\` — tap the Go Back outline button. Parent calls
  \`router.back()\` back to the email step.
`.trim();

const meta = {
  title: 'Auth / CreateAccountCodeBody',
  component: CreateAccountCodeBody,
  args: {
    email: 'name@website.com',
    code: '',
    codeLength: 5,
    isComplete: false,
    isPending: false,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onChangeCode: () => {},
    onSubmit: () => {},
    onGoBack: () => {},
  },
  argTypes: {
    email: { control: { type: 'text' } },
    code: { control: { type: 'text' } },
    codeLength: { control: { type: 'number' } },
    isComplete: { control: { type: 'boolean' } },
    isPending: { control: { type: 'boolean' } },
    onChangeCode: { action: 'onChangeCode' },
    onSubmit: { action: 'onSubmit' },
    onGoBack: { action: 'onGoBack' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof CreateAccountCodeBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    email: 'name@website.com',
    code: '',
    isComplete: false,
    isPending: false,
  },
  parameters: {
    notes: `
## Empty

First-paint state. The OTP field is empty and auto-focused, and Submit
is disabled. This is what a user sees the moment they land on
\`/auth/create-account-code\` after the email step succeeded.
    `.trim(),
  },
};

export const Typing: Story = {
  args: {
    email: 'name@website.com',
    code: '123',
    isComplete: false,
    isPending: false,
  },
  parameters: {
    notes: `
## Typing

Partial code — three of five digits entered. Submit stays disabled
until the user completes the code; the hook's auto-submit effect fires
the moment the field becomes complete, so Submit is a fallback the
user rarely needs to press.
    `.trim(),
  },
};

export const Submitting: Story = {
  args: {
    email: 'name@website.com',
    code: '12345',
    isComplete: true,
    isPending: true,
  },
  parameters: {
    notes: `
## Submitting

The code is complete and the \`verifyEmailSignIn\` mutation is in
flight. Submit shows a loader. In production this state is usually
entered by the hook's auto-submit effect rather than a tap.

**Watch out:** if this state lingers, something's stuck on the OTP
verification — check the backend or network.
    `.trim(),
  },
};

export const LongEmail: Story = {
  args: {
    email: 'someone-with-a-very-long-address@example-domain-name.com',
    code: '',
    isComplete: false,
    isPending: false,
  },
  parameters: {
    notes: `
## LongEmail

Edge case: a long email string in the explainer copy. Confirms the
text wraps cleanly and doesn't push the OTP field or CTAs out of view.
    `.trim(),
  },
};
