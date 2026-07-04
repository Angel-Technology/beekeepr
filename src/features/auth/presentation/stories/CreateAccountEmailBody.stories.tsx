/**
 * Stories for the "Enter email" account-creation body. Renders the
 * actual `CreateAccountEmailBody` — the same component the connected
 * `CreateAccountEmailScreen` mounts in production. No inline preview,
 * no duplicated JSX: the screen is a thin connected wrapper that calls
 * `useCreateAccountEmailForm` and passes data into the body, so storying
 * the body is equivalent to storying the screen minus the router hook.
 *
 * Type in the field or tap the buttons in the canvas — `onChangeEmail`,
 * `onValidate`, `onSend`, and `onGoBack` fire into the Actions panel.
 * See `./CreateAccountEmailBody.docs.md` for the full anatomy and usage
 * context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { CreateAccountEmailBody } from '../components/CreateAccountEmailBody';

const componentNotes = `
# CreateAccountEmailBody

The email-entry body reached from the \`/auth/create-account-email\`
route. Renders the brand mark, "Enter email" title, explainer copy, a
single email \`Input\` inside a \`FormCard\`, an inline server-error
line, and the Go Back + Send button row.

## States driven by the hook

- \`canSubmit\` — trimmed email is non-empty and passes the email
  regex. Gates the Send CTA.
- \`isPending\` — the \`requestEmailSignIn\` mutation is in flight;
  the Send button shows a loader.
- \`shouldShowEmailError\` — the hook flips this on only after blur or
  submit-editing so the screen stays quiet on first paint.
- \`serverError\` — non-null when the OTP-request mutation failed;
  rendered as a red inline string below the form.

## Callbacks

- \`onChangeEmail\` — text input change.
- \`onValidate\` — fired on blur and submit-editing; the hook uses it
  to arm inline validation.
- \`onSend\` — tap the Send CTA. Parent runs the mutation and, on
  success, pushes \`/auth/create-account-code\`.
- \`onGoBack\` — tap the Go Back outline button. Parent calls
  \`router.back()\`.
`.trim();

const meta = {
  title: 'Auth / CreateAccountEmailBody',
  component: CreateAccountEmailBody,
  args: {
    email: '',
    canSubmit: false,
    isPending: false,
    shouldShowEmailError: false,
    serverError: null,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onChangeEmail: () => {},
    onValidate: () => {},
    onSend: () => {},
    onGoBack: () => {},
  },
  argTypes: {
    email: { control: { type: 'text' } },
    canSubmit: { control: { type: 'boolean' } },
    isPending: { control: { type: 'boolean' } },
    shouldShowEmailError: { control: { type: 'boolean' } },
    serverError: { control: { type: 'text' } },
    onChangeEmail: { action: 'onChangeEmail' },
    onValidate: { action: 'onValidate' },
    onSend: { action: 'onSend' },
    onGoBack: { action: 'onGoBack' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof CreateAccountEmailBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    email: '',
    canSubmit: false,
    isPending: false,
    shouldShowEmailError: false,
    serverError: null,
  },
  parameters: {
    notes: `
## Empty

First-paint state. The field is empty, validation is disarmed, and Send
is disabled. This is what a user sees the moment they land on
\`/auth/create-account-email\`.
    `.trim(),
  },
};

export const ReadyToSubmit: Story = {
  args: {
    email: 'name@website.com',
    canSubmit: true,
    isPending: false,
    shouldShowEmailError: false,
    serverError: null,
  },
  parameters: {
    notes: `
## ReadyToSubmit

Field holds a valid email; the hook has flipped \`canSubmit\` on. Send
is enabled. Tapping it will fire \`onSend\` and start the mutation.
    `.trim(),
  },
};

export const Submitting: Story = {
  args: {
    email: 'name@website.com',
    canSubmit: true,
    isPending: true,
    shouldShowEmailError: false,
    serverError: null,
  },
  parameters: {
    notes: `
## Submitting

\`isPending\` is true while the \`requestEmailSignIn\` mutation is in
flight. Send shows a loader; the field stays interactive but the user
has already committed.

**Watch out:** if this state lingers, something's stuck on the OTP
request — check the backend or network.
    `.trim(),
  },
};

export const WithInlineValidationError: Story = {
  args: {
    email: 'not-an-email',
    canSubmit: false,
    isPending: false,
    shouldShowEmailError: true,
    serverError: null,
  },
  parameters: {
    notes: `
## WithInlineValidationError

The user typed something, blurred (or tried to submit), and the address
didn't match the email regex. The hook armed validation and the field
now renders "Please enter a valid email address." Send stays disabled
until the input becomes valid.
    `.trim(),
  },
};

export const WithServerError: Story = {
  args: {
    email: 'name@website.com',
    canSubmit: true,
    isPending: false,
    shouldShowEmailError: false,
    serverError: 'Something went wrong. Please try again.',
  },
  parameters: {
    notes: `
## WithServerError

\`requestEmailSignIn\` rejected. The hook forwards the thrown error's
\`.message\` as \`serverError\` and the body renders it as a red inline
line below the form. Send is re-enabled so the user can retry.
    `.trim(),
  },
};
