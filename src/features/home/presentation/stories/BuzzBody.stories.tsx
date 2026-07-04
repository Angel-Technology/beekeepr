/**
 * Stories for the Buzz tab body — the post-auth landing screen reached
 * from the bottom-tab bar. Renders the actual `BuzzBody`, the same
 * component the connected `BuzzScreen` mounts in production. No inline
 * preview, no duplicated JSX: the screen is a thin wrapper that runs
 * `useBuzzTab` + `useAuthSession` + `useDismissibleOnce` and forwards
 * the outputs into this body, so storying the body is equivalent to
 * storying the screen minus the router / TanStack Query / RevenueCat
 * providers.
 *
 * Flip the `flow` control to preview each of the five variants
 * (`verify`, `membership`, `renewal`, `welcome`, `denied`) plus the
 * pre-flow skeleton (`null`). Tap the profile / hamburger icons and
 * watch the callbacks fire in the Actions panel. See
 * `./BuzzBody.docs.md` for the full anatomy and flow definitions.
 */
import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  BackgroundCheckBadge,
  ContactVisibility,
  ProfileVisibility,
} from '@features/auth';

import { BuzzBody } from '../components/BuzzBody';
import type { Connection, Invite, BlockedUser } from '../../models/home.types';

// Fixture rows shaped to `UserConnectionFieldsFragment`. Real data comes
// from GraphQL; here we hand-craft enough to render list variants.
const makeUser = (
  id: string,
  nickname: string,
  handle: string,
  approved = true,
): Connection => ({
  id,
  nickname,
  displayName: nickname,
  handle,
  imageUrl: null,
  backgroundCheckBadge: approved
    ? BackgroundCheckBadge.Approved
    : BackgroundCheckBadge.None,
  backgroundCheckBadgeExpiresAtUtc: null,
  checkrLastCheckAtUtc: null,
  connectionCreatedAtUtc: '2026-01-01T00:00:00Z',
  userCreatedAtUtc: '2025-12-01T00:00:00Z',
  profileVisibility: ProfileVisibility.Public,
  contactVisibility: ContactVisibility.ConnectionsOnly,
  googleVoicePhone: null,
  whatsAppPhone: null,
  instagramHandle: null,
  telegramHandle: null,
  snapchatHandle: null,
  signalPhone: null,
});

const CONNECTIONS: readonly Connection[] = [
  makeUser('c1', 'Ava', 'ava'),
  makeUser('c2', 'Ben', 'ben'),
  makeUser('c3', 'Chloe', 'chloe'),
];
const INCOMING: readonly Invite[] = [makeUser('i1', 'Diego', 'diego')];
const OUTGOING: readonly Invite[] = [makeUser('o1', 'Eli', 'eli')];
const BLOCKED: readonly BlockedUser[] = [];

const membershipProps = {
  isPurchasing: false,
  reminderLabel: 'In 25 days',
  trialEndLabel: 'March 22, 2026',
  onStartTrial: () => {},
  onEnterPromoCode: () => {},
};

const renewalProps = {
  isPurchasing: false,
  onRenew: () => {},
  onEnterPromoCode: () => {},
};

const welcomeProps = {
  connections: CONNECTIONS,
  invites: INCOMING,
  sentInvites: OUTGOING,
  blockedUsers: BLOCKED,
  isOnTrial: true,
  trialDaysRemaining: 21,
  activeTab: 'connections' as const,
  onChangeTab: () => {},
  onAcceptInvite: () => {},
  onDeclineInvite: () => {},
  onCancelInvite: () => {},
  onUnblockUser: () => {},
  onPressConnection: () => {},
  onPressInvite: () => {},
  onPressSentInvite: () => {},
  onPressBlockedUser: () => {},
  acceptPendingId: null,
  declinePendingId: null,
  cancelPendingId: null,
  unblockPendingId: null,
};

const promoModalProps = {
  visible: false,
  code: '',
  error: null,
  isRedeeming: false,
  canRedeem: false,
  onChangeCode: () => {},
  onRedeem: () => {},
  onClose: () => {},
};

const componentNotes = `
# BuzzBody

The Buzz tab presentation body — one screen, five render variants, all
driven by the \`flow\` prop. In production \`useBuzzTab\` derives the
variant from the badge state + RevenueCat's \`isPro\` flag.

## Flow variants (\`flow\` control)

- \`null\` — pre-flow skeleton. Rendered until both the auth session and
  RevenueCat customer info have resolved so we don't flash \`verify\` →
  \`membership\` → \`welcome\` while sources land.
- \`verify\` — user has not verified yet OR is approved but not
  subscribed. Renders \`BuzzVerifyFlow\` (Stand-Out hero, testimonials,
  primary + optional "Learn more" CTAs).
- \`denied\` — terminal Persona-declined or Checkr-denied. Renders the
  \`BuzzScreeningDeniedCard\` above \`BuzzVerifyFlow\` (with the trial
  buttons hidden — the appeal action owns the CTA).
- \`membership\` — approved but no subscription. Renders
  \`BuzzMembershipFlow\` + confetti overlay.
- \`renewal\` — previously subscribed and lapsed. Renders
  \`BuzzRenewalFlow\` (skips the trial pitch — Apple/Google won't honor a
  second free trial for the same group).
- \`welcome\` — badge approved AND \`isPro\`. Renders \`BuzzWelcomeFlow\`
  with connections / invites / blocked lists.

## Interactive bits

- **Profile icon (top-left)** — fires \`onOpenProfile\`.
- **Menu (top-right)** — fires \`onOpenMenu\`.
- **Pull-to-refresh** — fires \`onRefresh\`.
- **Safety modal** — toggle \`showSafetyDisclaimer\` in the controls to
  open it; \`onDismissSafetyDisclaimer\` fires on close with a boolean
  for the "Don't show again" checkbox state.
`.trim();

const meta = {
  title: 'Home / BuzzBody',
  component: BuzzBody,
  args: {
    flow: 'welcome',
    ctaLabel: 'Get Started',
    profileImageUrl: null,
    isRefreshing: false,
    showSafetyDisclaimer: false,
    membershipProps,
    renewalProps,
    welcomeProps,
    promoModalProps,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGetStarted: () => {},
    onLearnMore: () => {},
    onRefresh: () => {},
    onOpenProfile: () => {},
    onOpenMenu: () => {},
    onAppealDecision: () => {},
    onDismissSafetyDisclaimer: () => {},
  },
  argTypes: {
    flow: {
      control: { type: 'select' },
      options: [null, 'verify', 'denied', 'membership', 'renewal', 'welcome'],
    },
    ctaLabel: { control: { type: 'text' } },
    profileImageUrl: { control: { type: 'text' } },
    isRefreshing: { control: { type: 'boolean' } },
    showSafetyDisclaimer: { control: { type: 'boolean' } },
    onGetStarted: { action: 'onGetStarted' },
    onLearnMore: { action: 'onLearnMore' },
    onRefresh: { action: 'onRefresh' },
    onOpenProfile: { action: 'onOpenProfile' },
    onOpenMenu: { action: 'onOpenMenu' },
    onAppealDecision: { action: 'onAppealDecision' },
    onDismissSafetyDisclaimer: { action: 'onDismissSafetyDisclaimer' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof BuzzBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { flow: null },
  parameters: {
    notes: `
## Loading (skeleton)

Pre-flow placeholder rendered while the auth session and RevenueCat
customer info are still resolving. Mirrors the dominant \`welcome\`
layout so the swap doesn't shift content.
    `.trim(),
  },
};

export const Verify: Story = {
  args: { flow: 'verify', ctaLabel: 'Get Started' },
  parameters: {
    notes: `
## Verify

Fresh user OR mid-verification. \`ctaLabel\` cycles through
\`Get Started\` → \`Resume\` → \`Start membership\` depending on the
gate state — try each string in the controls.

**Try this:** clear \`onLearnMore\` in production this is \`undefined\`
for approved-but-not-subscribed users. Storybook wires the action for
you regardless.
    `.trim(),
  },
};

export const Denied: Story = {
  args: { flow: 'denied', ctaLabel: 'Get Started' },
  parameters: {
    notes: `
## Denied

Terminal Persona-declined or Checkr-denied user. Renders the appeal
card above the Stand-Out hero; \`BuzzVerifyFlow\` hides its own CTAs
so the appeal button is the only action.
    `.trim(),
  },
};

export const Membership: Story = {
  args: { flow: 'membership' },
  parameters: {
    notes: `
## Membership

Approved but no active subscription. Renders \`BuzzMembershipFlow\`
(30-day trial pitch, promo code path) plus the confetti overlay —
a one-shot celebration when the badge first clears.
    `.trim(),
  },
};

export const Renewal: Story = {
  args: { flow: 'renewal' },
  parameters: {
    notes: `
## Renewal

Previously subscribed and lapsed. Skips the trial pitch — Apple/Google
won't honor a second free trial for the same subscription group — and
routes straight to a "Renew" CTA that hits the OS purchase sheet.
    `.trim(),
  },
};

export const Welcome: Story = {
  args: { flow: 'welcome' },
  parameters: {
    notes: `
## Welcome

Badge approved and \`isPro\` — the connections home. Renders the
tab pill (Connections / Invites) plus the trial-countdown card while
\`isOnTrial\` is true. Fixture data seeds three connections, one
incoming, one outgoing, no blocked.
    `.trim(),
  },
};

export const WelcomeEmpty: Story = {
  args: {
    flow: 'welcome',
    welcomeProps: {
      ...welcomeProps,
      connections: [],
      invites: [],
      sentInvites: [],
      blockedUsers: [],
      isOnTrial: false,
      trialDaysRemaining: null,
    },
  },
  parameters: {
    notes: `
## Welcome — empty

Approved + subscribed but no connections yet. Confirms the empty
states in \`BuzzConnectionsCard\` render correctly and the trial
countdown card is suppressed when \`isOnTrial\` is false.
    `.trim(),
  },
};

// Component wrapper so `useState` is legal inside the story `render`.
// The rules-of-hooks lint rejects hooks in plain functions — extracting
// into an uppercase-named component satisfies it.
const SafetyDisclaimerRender = (args: ComponentProps<typeof BuzzBody>) => {
  const [visible, setVisible] = useState(args.showSafetyDisclaimer);
  return (
    <BuzzBody
      {...args}
      showSafetyDisclaimer={visible}
      onDismissSafetyDisclaimer={(shouldPersist) => {
        setVisible(false);
        args.onDismissSafetyDisclaimer(shouldPersist);
      }}
    />
  );
};

export const SafetyDisclaimer: Story = {
  args: { flow: 'welcome', showSafetyDisclaimer: true },
  // Local state wrapper so tapping the X or "Got it!" actually closes
  // the modal — the actions addon still fires so callers can observe
  // the `shouldPersist` boolean in the Actions panel.
  render: (args) => (
    <SafetyDisclaimerRender {...(args as ComponentProps<typeof BuzzBody>)} />
  ),
  parameters: {
    notes: `
## Safety disclaimer

First-time \`welcome\` visitors see the safety modal. Tap "Got it!" or
the X to close it — \`onDismissSafetyDisclaimer\` fires with the
"Don't show this to me again" checkbox state at the moment of close.
    `.trim(),
  },
};
