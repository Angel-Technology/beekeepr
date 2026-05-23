/**
 * Stories for the kickoff body of the verification flow — phase 1 of the
 * post-paywall state machine. This is what the user sees the moment they
 * land on `/verify-identity` before tapping "Start verification"
 * to launch the Persona SDK.
 *
 * Press the CTA in the canvas — `onStart` and `onMoreInfo` fire into the
 * Actions panel. See `./IdentityKickoffSection.docs.md` for the full
 * usage context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { IdentityKickoffSection } from '../sections/IdentityKickoffSection';

const componentNotes = `
# IdentityKickoffSection

Body of the consolidated verification flow's \`kickoff\` phase. Step 1 of 2,
intro copy, illustration, privacy compliance card, and the
"Start verification" CTA that launches the Persona SDK.

## States

- \`isStarting === false\` (default) — CTA is enabled.
- \`isStarting === true\` — CTA shows the bounce loader; user has tapped
  Start and the backend is minting the Persona inquiry. Persona's native
  sheet opens shortly after.

## Callbacks

- \`onStart\` — start the Persona flow.
- \`onMoreInfo\` — open the parent screen's privacy modal.
`.trim();

const meta = {
  title: 'Verification / IdentityKickoffSection',
  component: IdentityKickoffSection,
  args: {
    isStarting: false,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onStart: () => {},
    onMoreInfo: () => {},
  },
  argTypes: {
    isStarting: { control: { type: 'boolean' } },
    onStart: { action: 'onStart' },
    onMoreInfo: { action: 'onMoreInfo' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof IdentityKickoffSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Idle state. CTA is enabled and ready to launch Persona.

**When this is what you see:** the user just landed on the screen after
paying or resuming the flow. \`identityVerificationStatus\` is \`NotStarted\`.
    `.trim(),
  },
};

export const Starting: Story = {
  args: { isStarting: true },
  parameters: {
    notes: `
## Starting

\`isStarting\` is true while we're awaiting the backend's Persona inquiry
mint. The CTA shows a loader; the section doesn't transition phases yet —
the screen swaps to \`waiting\` only after Persona's native sheet closes
and \`identityVerificationStatus\` flips out of \`NotStarted\`.

**Watch out:** if this state lingers, something's stuck on the
\`startPersonaInquiry\` mutation — check the backend gate or network.
    `.trim(),
  },
};
