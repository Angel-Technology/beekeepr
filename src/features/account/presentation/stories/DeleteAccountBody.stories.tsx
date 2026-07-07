/**
 * Stories for the Delete Account confirmation body. Renders the actual
 * `DeleteAccountBody` — the same component the connected
 * `DeleteAccountScreen` mounts in production. No inline preview: the
 * screen is a thin connected wrapper that owns the deletion mutation
 * and the manage-subscription deep link.
 *
 * Tap the Delete Account button to open the local confirm modal —
 * `onConfirmDelete` fires from inside the modal. Tap Cancel, header
 * back, Privacy Policy, or Manage Subscription to see the matching
 * callback fire in the Actions panel. See
 * `./DeleteAccountBody.docs.md` for the full anatomy and usage context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { DeleteAccountBody } from '../components/DeleteAccountBody';

const componentNotes = `
# DeleteAccountBody

The account-deletion confirmation surface reached from the account
settings hub. Renders the intro copy, a link to the Privacy Policy,
the consequences \`DetailCard\`, an optional Manage Subscription
button, and the Cancel + Delete Account bottom action bar.

## Local UI state

The confirm modal's open/closed flag lives inside the body — tapping
Delete Account opens it, tapping X or the backdrop closes it (unless
\`isDeleting\` is true, in which case dismissal is blocked so the user
can't back out mid-request). The mutation itself lives in the connected
screen; the body only fires \`onConfirmDelete\` when the user confirms
inside the modal.

## Subscription-history gating

\`hasSubscriptionHistory\` maps to \`isPro || isLapsed\` in production —
the body hides the Manage Subscription button when the user has never
had a paid plan, because RevenueCat's manage-subscription deep link
errors for accounts with no subscription history at all.

## States

- \`isDeleting === false\` (default) — buttons interactive.
- \`isDeleting === true\` — Cancel + Manage Subscription disabled,
  Delete Account shows loading spinner, confirm modal blocks dismissal.
- \`hasSubscriptionHistory === false\` — Manage Subscription hidden.
`.trim();

const meta = {
  title: 'Account / DeleteAccountBody',
  component: DeleteAccountBody,
  args: {
    isDeleting: false,
    hasSubscriptionHistory: true,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGoBack: () => {},
    onOpenPrivacyPolicy: () => {},
    onManageSubscription: () => {},
    onCancel: () => {},
    onConfirmDelete: () => {},
  },
  argTypes: {
    isDeleting: { control: { type: 'boolean' } },
    hasSubscriptionHistory: { control: { type: 'boolean' } },
    onGoBack: { action: 'onGoBack' },
    onOpenPrivacyPolicy: { action: 'onOpenPrivacyPolicy' },
    onManageSubscription: { action: 'onManageSubscription' },
    onCancel: { action: 'onCancel' },
    onConfirmDelete: { action: 'onConfirmDelete' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof DeleteAccountBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Idle state, subscription history present. All buttons interactive; the
Manage Subscription button is visible above the bottom action bar.
Tap Delete Account to open the confirm modal.
    `.trim(),
  },
};

export const NoSubscriptionHistory: Story = {
  args: { hasSubscriptionHistory: false },
  parameters: {
    notes: `
## No subscription history

Never-paid user. The Manage Subscription button is hidden so we don't
hand them into a deep link RevenueCat will refuse.
    `.trim(),
  },
};

export const Deleting: Story = {
  args: { isDeleting: true },
  parameters: {
    notes: `
## Deleting

Deletion request is in flight. Cancel and Manage Subscription go
disabled; the Delete Account button shows the loading spinner. If the
confirm modal is open, its dismiss handler is a no-op so the user
can't back out mid-request.
    `.trim(),
  },
};
