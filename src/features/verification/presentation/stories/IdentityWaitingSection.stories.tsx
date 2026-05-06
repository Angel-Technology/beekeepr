/**
 * Stories for the waiting body of the verification flow — phase 2 of the
 * post-paywall state machine. The Persona SDK has closed; we're polling
 * the backend for the webhook to land. This section has no controls; it's
 * a pure spinner state.
 *
 * See `./IdentityWaitingSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { IdentityWaitingSection } from '../components/IdentityWaitingSection';

const componentNotes = `
# IdentityWaitingSection

Body of the \`waiting\` phase. The user has finished the Persona SDK on
their side; we're polling \`currentUser\` every 2s for the backend webhook
to flip \`identityVerificationStatus\` from \`Pending\` / \`Completed\` to
\`Approved\` / \`Declined\`.

No CTA — the user just waits. After ~30s without resolution, the parent
flow swaps in \`IdentityTimedOutSection\`.
`.trim();

const meta = {
  title: 'Verification / IdentityWaitingSection',
  component: IdentityWaitingSection,
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof IdentityWaitingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The only state. Spinner + reassurance copy. There's no interaction — the
user just waits while the screen polls. Visual changes here happen by
swapping the *whole section* (to timed-out, declined, or criminal-intro)
once the polling resolves.
    `.trim(),
  },
};
