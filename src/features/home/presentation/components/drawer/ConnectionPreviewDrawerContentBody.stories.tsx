/**
 * Stories for the right-side connection-preview drawer body — the panel
 * that opens when someone taps a user row on the home Buzz tab or the
 * search results list. Renders the actual
 * `ConnectionPreviewDrawerContentBody`, the same component the
 * connected `ConnectionPreviewDrawerContent` mounts in production. No
 * inline preview, no duplicated JSX: the wrapper runs the seven
 * friendship-mutation hooks + `useConfirmDestructive` and forwards a
 * callback bundle into this body, so storying the body is equivalent
 * to storying the connected drawer minus the GraphQL client + confirm
 * modal provider.
 *
 * Flip the `source` and `friendshipState` controls to preview each
 * header variant. Tap the CTAs and the kebab and watch the callbacks
 * fire in the Actions panel. See
 * `./ConnectionPreviewDrawerContentBody.docs.md` for the full anatomy
 * and the source × friendshipState matrix.
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  BackgroundCheckBadge,
  ContactVisibility,
  ProfileVisibility,
} from '@features/auth';
import type { ProfilePreviewUser } from '@components';

import { ConnectionPreviewDrawerContentBody } from './ConnectionPreviewDrawerContentBody';

// Factory patterned after `SearchBody.stories.tsx` — build a plausible
// `ProfilePreviewUser` with sensible defaults and let each variant
// override the fields that matter for its scenario.
const makeUser = (
  overrides: Partial<ProfilePreviewUser> = {},
): ProfilePreviewUser => ({
  id: 'u1',
  nickname: 'Ava Palmer',
  displayName: 'Ava Palmer',
  handle: 'ava',
  imageUrl: null,
  backgroundCheckBadge: BackgroundCheckBadge.Approved,
  backgroundCheckBadgeExpiresAtUtc: '2026-08-15T00:00:00Z',
  checkrLastCheckAtUtc: '2026-02-15T00:00:00Z',
  userCreatedAtUtc: '2025-11-01T00:00:00Z',
  profileVisibility: ProfileVisibility.Public,
  contactVisibility: ContactVisibility.ConnectionsOnly,
  googleVoicePhone: null,
  whatsAppPhone: '5551234567',
  instagramHandle: 'ava.palmer',
  telegramHandle: null,
  snapchatHandle: 'ava.palmer',
  signalPhone: null,
});

const DEFAULT_USER = makeUser();

const componentNotes = `
# ConnectionPreviewDrawerContentBody

The right-side drawer body opened when someone taps a user row — used
by BOTH the home connections tab AND the search tab. The same body
renders in both, driven by \`source\` (which list the row came from)
and \`friendshipState\` (the viewer's relationship to the previewed
user). The connected \`ConnectionPreviewDrawerContent\` runs the seven
mutation hooks + \`useConfirmDestructive\` and forwards a callback
bundle into this body.

## Header actions by \`source\`

- \`connection\` (or \`null\` default) → Remove (friend)
- \`invite\` → Decline + Approve
- \`sent-invite\` → Unsend
- \`blocked\` → Unblock
- \`search\` → Invite (NONE) or Unsend (REQUEST_SENT). Flag / Block
  stay in the kebab so the affordance set matches every other source
  rather than gaining a one-off inline pair.

## Kebab menu (every source)

The kebab dropdown shows Block + Flag on every source. In production
both go through \`ConfirmDestructiveModal\` in the wrapper — the body
just fires the \`onBlock\` / \`onFlag\` callback it was given, closing
the menu first as a UI-level side effect.

## Local UI state

The body owns the actions-menu visibility (a \`useState\`) plus the
outside-tap dismissal overlay. All feature hooks and the destructive
confirm live in the connected wrapper — the body itself has no
knowledge of TanStack Query, GraphQL, or navigation.

## Callbacks

- \`onClose\` — back chevron. Wrapper calls \`navigation.closeDrawer()\`.
- \`onRemove\` — Remove-friend from the \`connection\` header. Wrapper
  wraps in \`useConfirmDestructive\`.
- \`onAccept\` / \`onDecline\` — invite response from the \`invite\`
  header.
- \`onUnsend\` — cancel an outgoing invite (\`sent-invite\` or search
  \`REQUEST_SENT\`).
- \`onUnblock\` — unblock from the \`blocked\` header.
- \`onSendInvite\` — send an invite from the search \`NONE\` header.
- \`onBlock\` / \`onFlag\` — kebab actions. Wrapper wraps both in
  \`useConfirmDestructive\`.
`.trim();

const meta = {
  title: 'Home / ConnectionPreviewDrawerContentBody',
  component: ConnectionPreviewDrawerContentBody,
  args: {
    user: DEFAULT_USER,
    source: 'connection',
    friendshipState: null,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onClose: () => {},
    onRemove: () => {},
    onAccept: () => {},
    onDecline: () => {},
    onUnsend: () => {},
    onUnblock: () => {},
    onSendInvite: () => {},
    onBlock: () => {},
    onFlag: () => {},
  },
  argTypes: {
    source: {
      control: { type: 'select' },
      options: [null, 'connection', 'invite', 'sent-invite', 'blocked', 'search'],
    },
    friendshipState: {
      control: { type: 'select' },
      options: [null, 'FRIENDS', 'NONE', 'REQUEST_RECEIVED', 'REQUEST_SENT'],
    },
    onClose: { action: 'onClose' },
    onRemove: { action: 'onRemove' },
    onAccept: { action: 'onAccept' },
    onDecline: { action: 'onDecline' },
    onUnsend: { action: 'onUnsend' },
    onUnblock: { action: 'onUnblock' },
    onSendInvite: { action: 'onSendInvite' },
    onBlock: { action: 'onBlock' },
    onFlag: { action: 'onFlag' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ConnectionPreviewDrawerContentBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromHome_None: Story = {
  args: {
    source: 'connection',
    friendshipState: 'NONE',
  },
  parameters: {
    notes: `
## From home — no friendship (\`connection\` fallback)

Row opened from the home connections list with no active friendship
edge (rare in practice — the row itself would normally already be a
\`connection\`). Header falls through to the default Remove button.
Included to preview the fallback path when the store's
\`friendshipState\` hasn't landed yet.
    `.trim(),
  },
};

export const FromHome_Invited: Story = {
  args: {
    source: 'sent-invite',
    friendshipState: 'REQUEST_SENT',
  },
  parameters: {
    notes: `
## From home — outgoing invite (Unsend)

Row opened from the "Invites" tab, outgoing sub-list. Header renders
the Unsend CTA. Reversible action — the wrapper fires
\`cancelInvite\` and closes the drawer immediately (no confirm).
    `.trim(),
  },
};

export const FromHome_Connected: Story = {
  args: {
    source: 'connection',
    friendshipState: 'FRIENDS',
  },
  parameters: {
    notes: `
## From home — connected (Remove)

Row opened from the "Connections" tab. Header renders the Remove
button. In production the wrapper wraps \`onRemove\` in
\`useConfirmDestructive\` — a "Remove connection?" sheet with a
Cancel / Remove pair.
    `.trim(),
  },
};

export const FromHome_Incoming: Story = {
  args: {
    source: 'invite',
    friendshipState: 'REQUEST_RECEIVED',
  },
  parameters: {
    notes: `
## From home — incoming invite (Approve + Decline)

Row opened from the "Invites" tab, incoming sub-list. Header renders
both a Decline (outline) and Approve (solid) button side-by-side.
Both actions are reversible and fire-and-close from the wrapper.
    `.trim(),
  },
};

export const FromSearch: Story = {
  args: {
    source: 'search',
    friendshipState: 'NONE',
    user: makeUser({ id: 'u2', nickname: 'Ben Hart', handle: 'ben' }),
  },
  parameters: {
    notes: `
## From search — no relationship (Send Invite)

Row opened from the Search tab. \`source: 'search'\` + \`NONE\` renders
the solid Send Invite CTA. Same body, different header per the
search-feature memory (search-source drives the Flag / Block / Invite
header layout).

Flip \`friendshipState\` to \`REQUEST_SENT\` in the controls to preview
the Unsend variant on the same row.
    `.trim(),
  },
};

export const Blocked: Story = {
  args: {
    source: 'blocked',
    friendshipState: null,
    user: makeUser({ id: 'u3', nickname: 'Chloe Kim', handle: 'chloe' }),
  },
  parameters: {
    notes: `
## Blocked (Unblock)

Row opened from the "Blocked" tab. Header renders the Unblock CTA.
Reversible — the wrapper fires \`unblockUser\` and closes immediately.
Blocked users still expose Flag / Block in the kebab (Block being a
no-op relative to their current state, but included for parity).
    `.trim(),
  },
};

export const ActionsMenuOpen: Story = {
  args: {
    source: 'connection',
    friendshipState: 'FRIENDS',
  },
  parameters: {
    notes: `
## Actions menu open

Previews the kebab dropdown (Block / Flag). Since the menu-visibility
state is internal to the body (a UI-only \`useState\`, not a prop),
Storybook can't force it open from outside. Tap the kebab in the
top-right of the header to toggle the menu — the body persists the
open state between renders. Tap outside the menu (below the header),
scroll the body, or tap a menu item to close it.

Wiring: tapping Block or Flag closes the menu, then fires the
matching callback. In production the wrapper's
\`useConfirmDestructive\` then opens the confirm sheet before the
mutation runs.
    `.trim(),
  },
};
