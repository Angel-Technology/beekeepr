/**
 * Stories for the declined body of the verification flow — what we show
 * after Persona returns a terminal failure (`Declined` / `Failed` /
 * `Expired`). Retry button relaunches the SDK via the same path the
 * kickoff section uses.
 *
 * See `./IdentityDeclinedSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { IdentityDeclinedSection } from '../sections/IdentityDeclinedSection';

const componentNotes = `
# IdentityDeclinedSection

Body of the \`declined\` phase. Persona returned a terminal status —
\`Declined\` (verdict failed), \`Failed\` (technical issue), or \`Expired\`
(inquiry timed out on Persona's side). Per the backend contract, retrying
mints a fresh Persona inquiry rather than reusing the bad one.

## States

- \`isStarting === false\` (default) — retry CTA is enabled.
- \`isStarting === true\` — retry is in flight; CTA shows the bounce loader.

## Callbacks

- \`onRetry\` — same handler as the kickoff section's \`onStart\`. Calls
  \`useVerificationActions.startPersonaVerification.mutateAsync()\`.
`.trim();

const meta = {
  title: 'Verification / IdentityDeclinedSection',
  component: IdentityDeclinedSection,
  args: {
    isStarting: false,
    // Storybook's action addon replaces this at render time via
    // `argTypes.action` below — the stub satisfies TS.
    onRetry: () => {},
  },
  argTypes: {
    isStarting: { control: { type: 'boolean' } },
    onRetry: { action: 'onRetry' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof IdentityDeclinedSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Idle declined state. Retry is enabled.

**When this is what you see:** \`identityVerificationStatus\` is \`Declined\`,
\`Failed\`, or \`Expired\`.
    `.trim(),
  },
};

export const Starting: Story = {
  args: { isStarting: true },
  parameters: {
    notes: `
## Starting

The user tapped "Try again" and we're awaiting the new Persona inquiry.
Same loader pattern as the kickoff section.
    `.trim(),
  },
};
