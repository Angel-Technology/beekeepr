/**
 * Stories for the account settings body. Renders the actual `AccountBody`
 * — the same component the connected `AccountScreen` mounts in
 * production. No inline preview: the screen is a thin connected wrapper
 * that reads the auth session and the RevenueCat state, so storying the
 * body is equivalent to storying the screen minus those hooks.
 *
 * Tap the header back, either menu row, or the Delete Account row in
 * the canvas — the matching callback fires into the Actions panel. See
 * `./AccountBody.docs.md` for the full anatomy and usage context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { AccountBody } from '../components/AccountBody';

const componentNotes = `
# AccountBody

Account settings hub reached from the menu drawer. Renders the
read-only auth email, the subscription menu (Restore Purchase +
optional Manage Subscription), and the destructive Delete Account
entry point.

## Subscription-history gating

\`hasSubscriptionHistory\` maps to \`isPro || isLapsed\` in production —
the body hides the Manage Subscription row when the user has never had
a paid plan, because RevenueCat's manage-subscription deep link errors
for accounts with no subscription history at all.

## Callbacks

- \`onGoBack\` — parent calls \`router.back()\`.
- \`onRestorePurchases\` — parent runs the RevenueCat restore flow and
  shows the resulting success / no-purchases modal.
- \`onManageSubscription\` — parent opens the RevenueCat manage-subscription
  deep link.
- \`onDeleteAccount\` — parent routes to \`/delete-account\`.
`.trim();

const meta = {
  title: 'Account / AccountBody',
  component: AccountBody,
  args: {
    email: 'jane@example.com',
    hasSubscriptionHistory: true,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGoBack: () => {},
    onRestorePurchases: () => {},
    onManageSubscription: () => {},
    onDeleteAccount: () => {},
  },
  argTypes: {
    email: { control: { type: 'text' } },
    hasSubscriptionHistory: { control: { type: 'boolean' } },
    onGoBack: { action: 'onGoBack' },
    onRestorePurchases: { action: 'onRestorePurchases' },
    onManageSubscription: { action: 'onManageSubscription' },
    onDeleteAccount: { action: 'onDeleteAccount' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof AccountBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Pro / lapsed user — both subscription rows are visible. This is what
the production hub looks like for anyone who has ever paid.
    `.trim(),
  },
};

export const NoSubscriptionHistory: Story = {
  args: { hasSubscriptionHistory: false },
  parameters: {
    notes: `
## No subscription history

Never-paid user. The Manage Subscription row is hidden so we don't hand
them into a deep link RevenueCat will refuse. Restore Purchase stays
visible — that's the recovery path if they had a subscription tied to
a different account.
    `.trim(),
  },
};

export const EmptyEmail: Story = {
  args: { email: '' },
  parameters: {
    notes: `
## Empty email

Edge case where the auth session hasn't populated yet. The disabled
\`Input\` renders empty and the rest of the hub stays interactive. In
production the session resolves within a frame or two.
    `.trim(),
  },
};
