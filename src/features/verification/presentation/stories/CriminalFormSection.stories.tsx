/**
 * Stories for the criminal-form body — phase 6 (terminal) of the
 * verification flow. The user fills in their phone number; everything
 * else is read-only verified data from Persona. Submit kicks off the
 * Checkr instant criminal check; on success the flow exits home.
 *
 * The form text fields and submit button are wired into the canvas — type
 * a phone number and watch `onChangePhoneNumber` fire; tap Submit and
 * watch `onSubmit` fire. See `./CriminalFormSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { CriminalFormSection } from '../sections/CriminalFormSection';

const componentNotes = `
# CriminalFormSection

Body of the \`criminal-form\` phase. Verified name + DOB + license-state
are read-only (server-locked); phone number is the one editable input.
Submit calls the Checkr backend mutation and, on success, the parent
navigates home.

## Why phone is editable but the rest isn't

Persona doesn't capture phone — Checkr needs it for the instant criminal
search. Everything else comes from Persona's verified payload and
shouldn't drift from the source of truth, so those inputs are disabled.

## Submit gating

\`canSubmit\` requires both verified first/last name to be present and a
non-empty trimmed phone number. The button is \`disabled\` otherwise.

## States

- \`isSubmitting === false\`, \`canSubmit === true\` (default) — ready.
- \`isSubmitting === true\` — submission in flight; button shows loader.
- \`canSubmit === false\` — button is disabled; user hasn't entered a phone.
`.trim();

const meta = {
  title: 'Verification / CriminalFormSection',
  component: CriminalFormSection,
  args: {
    firstName: 'Jane',
    middleName: 'A',
    lastName: 'Smith',
    dateOfBirth: '01/15/1992',
    licenseState: 'CA',
    phoneNumber: '',
    phoneError: undefined,
    isSubmitting: false,
    canSubmit: false,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onChangePhoneNumber: () => {},
    onValidatePhoneNumber: () => {},
    onSubmit: () => {},
  },
  argTypes: {
    firstName: { control: { type: 'text' } },
    middleName: { control: { type: 'text' } },
    lastName: { control: { type: 'text' } },
    dateOfBirth: { control: { type: 'text' } },
    licenseState: { control: { type: 'text' } },
    phoneNumber: { control: { type: 'text' } },
    phoneError: { control: { type: 'text' } },
    isSubmitting: { control: { type: 'boolean' } },
    canSubmit: { control: { type: 'boolean' } },
    onChangePhoneNumber: { action: 'onChangePhoneNumber' },
    onValidatePhoneNumber: { action: 'onValidatePhoneNumber' },
    onSubmit: { action: 'onSubmit' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof CriminalFormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  parameters: {
    notes: `
## Empty (default)

User has just landed on the form. Phone is empty, submit is disabled,
verified fields show what Persona returned.
    `.trim(),
  },
};

export const Ready: Story = {
  args: { phoneNumber: '(555) 123-4567', canSubmit: true },
  parameters: {
    notes: `
## Ready

User has entered a phone number; \`canSubmit\` is true and the button is
enabled. Tap Submit to fire \`onSubmit\` into the Actions panel.
    `.trim(),
  },
};

export const Submitting: Story = {
  args: { phoneNumber: '(555) 123-4567', canSubmit: true, isSubmitting: true },
  parameters: {
    notes: `
## Submitting

Form is in flight. Button shows the bounce loader; presses are blocked
until the mutation resolves.

**Watch out:** \`isSubmitting\` already implies \`disabled\`-like behaviour
on the button — the form fields stay editable so a user can correct phone
during retry, but the submit can't fire twice.
    `.trim(),
  },
};

export const MissingVerifiedData: Story = {
  args: {
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    licenseState: '',
    phoneNumber: '(555) 123-4567',
    canSubmit: false,
  },
  parameters: {
    notes: `
## Missing verified data

Edge case where the user reached this section but Persona's verified
fields didn't populate (race with the auth-session refresh). \`canSubmit\`
stays false because verified first/last name are required. In production
this should resolve on the next session-cache tick.
    `.trim(),
  },
};
