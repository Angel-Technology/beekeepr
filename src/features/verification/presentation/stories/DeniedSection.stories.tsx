/**
 * Stories for the denied body of the verification flow — the terminal
 * "not approved" screen shown after Checkr returns a negative verdict on
 * the criminal-record search. Every CTA is fire-and-navigate; no async
 * loading state lives here.
 *
 * Press the CTAs in the canvas — `onGotIt`, `onAppealDecision`, and
 * `onMoreInfo` fire into the Actions panel. See `./DeniedSection.docs.md`
 * for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { DeniedSection } from '../sections/DeniedSection';

const componentNotes = `
# DeniedSection

Body of the \`denied\` phase — the terminal "not approved" state after
Checkr returned a negative verdict on the criminal-record search. There
is no loading state; every callback is fire-and-navigate.

## Callbacks

- \`onGotIt\` — dismisses the flow. Wired to the same \`onExit\` as the
  chevron-left in the header (per \`VerificationFlowBody\`, \`denied\` and
  \`congrats\` are terminal, so the top-left back skips the abandon modal).
- \`onAppealDecision\` — opens the support URL in an in-app browser
  (\`openInAppBrowser(environmentConfig.supportURL)\`). Users have 30 days
  from the denial to appeal.
- \`onMoreInfo\` — opens the parent screen's privacy modal.
`.trim();

const meta = {
  title: 'Verification / DeniedSection',
  component: DeniedSection,
  args: {
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGotIt: () => {},
    onAppealDecision: () => {},
    onMoreInfo: () => {},
  },
  argTypes: {
    onGotIt: { action: 'onGotIt' },
    onAppealDecision: { action: 'onAppealDecision' },
    onMoreInfo: { action: 'onMoreInfo' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof DeniedSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The only state. All three CTAs are always enabled — there's no async work
behind any of them, just navigation and modal toggles.

**When this is what you see:** the criminal-record search finished and
Checkr returned a fail verdict. The parent flow's \`phase === 'denied'\`.
    `.trim(),
  },
};
