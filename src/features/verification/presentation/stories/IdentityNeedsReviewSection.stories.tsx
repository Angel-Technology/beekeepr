/**
 * Stories for the needs-review body of the verification flow — what we
 * show when Persona has flagged the inquiry for manual review by a human.
 * Reassurance copy plus a "Back to home" CTA; the user should close the
 * app and wait for a session refresh (or, later, a push notification).
 *
 * See `./IdentityNeedsReviewSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { IdentityNeedsReviewSection } from '../sections/IdentityNeedsReviewSection';

const componentNotes = `
# IdentityNeedsReviewSection

Body of the \`needs-review\` phase. Persona returned a non-terminal
\`NeedsReview\` verdict — a human at Persona has to look at the submission
before we know whether it clears. Unlike \`waiting\` (a webhook poll that
usually resolves in under 30s), review can take hours or days, so we
stop the spinner illusion and let the user exit the flow.

## How this differs from \`IdentityWaitingSection\`

- \`waiting\` — automated webhook poll, seconds. No CTA; the section swaps
  itself out when the status flips.
- \`needs-review\` — human decision at Persona, hours to days. We surface
  a "Back to home" CTA because there's nothing useful to wait on.

## Callbacks

- \`onGoHome\` — exits to the home route (\`/(main)\`). Parent screen wires
  this to \`router.replace\`.
`.trim();

const meta = {
  title: 'Verification / IdentityNeedsReviewSection',
  component: IdentityNeedsReviewSection,
  args: {
    // Storybook's action addon replaces this at render time via
    // `argTypes.action` below — the stub satisfies TS.
    onGoHome: () => {},
  },
  argTypes: {
    onGoHome: { action: 'onGoHome' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof IdentityNeedsReviewSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Persona has flagged the inquiry for manual review. The user sees a title,
an explanation that a human is looking at the submission, and a "Back to
home" CTA. Tapping it fires \`onGoHome\` and exits the flow — the next
session refresh (or a push notification, once we wire that) will route
them past this screen when the reviewer signs off.
    `.trim(),
  },
};
