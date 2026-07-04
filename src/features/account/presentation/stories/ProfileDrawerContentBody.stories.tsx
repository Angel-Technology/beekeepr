/**
 * Stories for the signed-in user's own profile preview body — the
 * right-side drawer reached from the "Preview my profile" affordance.
 * Renders the actual `ProfileDrawerContentBody`, the same component the
 * connected `ProfileDrawerContent` mounts in production. No inline
 * preview, no duplicated JSX: the wrapper reads `useAuthSession`,
 * reshapes `createdAtUtc` → `userCreatedAtUtc`, and forwards the
 * resulting `ProfilePreviewUser` into this body.
 *
 * Cover: `Default` (verified approved user, filled profile), `NoUser`
 * (auth session hasn't resolved), `ProfileHidden` (visibility set to
 * Private), `Unverified` (badge = None). See
 * `./ProfileDrawerContentBody.docs.md` for anatomy + gating notes.
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  BackgroundCheckBadge,
  ContactVisibility,
  ProfileVisibility,
} from '@features/auth';
import type { ProfilePreviewUser } from '@components';

import { ProfileDrawerContentBody } from '../components/ProfileDrawerContentBody';

const makePreviewUser = (
  overrides: Partial<ProfilePreviewUser> = {},
): ProfilePreviewUser => ({
  id: 'self-1',
  nickname: 'Ada',
  displayName: 'Ada',
  handle: 'ada',
  imageUrl: null,
  backgroundCheckBadge: BackgroundCheckBadge.Approved,
  backgroundCheckBadgeExpiresAtUtc: '2026-12-01T00:00:00Z',
  checkrLastCheckAtUtc: '2026-06-01T00:00:00Z',
  userCreatedAtUtc: '2025-11-15T00:00:00Z',
  profileVisibility: ProfileVisibility.Public,
  contactVisibility: ContactVisibility.ConnectionsOnly,
  googleVoicePhone: null,
  whatsAppPhone: '5551234567',
  instagramHandle: 'ada.codes',
  telegramHandle: null,
  snapchatHandle: 'ada.codes',
  signalPhone: null,
  ...overrides,
});

const componentNotes = `
# ProfileDrawerContentBody

The right-side drawer body rendered for the signed-in user's own
profile preview. Composes the fixed chrome (app header + green
"This is how others see you." banner) with the shared
\`ProfilePreviewBody\` — the same body the connection preview drawer
and the search preview use.

## What this body owns

- The **Preview** app header (title only, no back button).
- The **"This is how others see you."** banner — copy specific to the
  own-profile context, which is why it stays in this body rather than
  the shared preview body.

## What the shared body owns (below the banner)

- Avatar + nickname + \`@handle\` + "member since".
- The **Buzz Badge** card with last / next screening dates.
- The **Contact information** card — only when
  \`contactVisibility === ConnectionsOnly\` AND at least one contact
  channel is filled.
- The **Safety disclaimer** at the bottom.

## Prop

- \`previewUser\` — the memoized \`ProfilePreviewUser\` the wrapper
  derives from \`useAuthSession\`. \`null\` means the auth query hasn't
  resolved yet; the header + banner still render, but the profile card
  is suppressed.
`.trim();

const meta = {
  title: 'Account / ProfileDrawerContentBody',
  component: ProfileDrawerContentBody,
  args: {
    previewUser: makePreviewUser(),
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfileDrawerContentBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    previewUser: makePreviewUser(),
  },
  parameters: {
    notes: `
## Default

Verified, approved user with a full profile: nickname, handle,
avatar-fallback, an approved Buzz Badge with both screening dates,
and a contact card with WhatsApp, Instagram, and Snapchat. This is
what most signed-in users see when they open their own preview.
    `.trim(),
  },
};

export const NoUser: Story = {
  args: {
    previewUser: null,
  },
  parameters: {
    notes: `
## No user (auth resolving)

Edge case: \`useAuthSession\` hasn't returned yet, so the wrapper
passes \`previewUser: null\`. The header + banner still render, but
the profile card is suppressed — no partial / flashing shell while
we wait for the query. First paint after cold start typically shows
this for a frame.
    `.trim(),
  },
};

export const ProfileHidden: Story = {
  args: {
    previewUser: makePreviewUser({
      profileVisibility: ProfileVisibility.Private,
    }),
  },
  parameters: {
    notes: `
## Profile hidden

User has toggled \`profileVisibility\` to \`Private\`. The shared
preview body doesn't currently short-circuit on this flag — the
consumer-side hide happens at the row / search-result level, not in
the preview drawer — so the drawer still renders the same content
here. Kept as a story to make the intent visible and to catch a
future change that hides the body from the user themselves.
    `.trim(),
  },
};

export const Unverified: Story = {
  args: {
    previewUser: makePreviewUser({
      backgroundCheckBadge: BackgroundCheckBadge.None,
      backgroundCheckBadgeExpiresAtUtc: null,
      checkrLastCheckAtUtc: null,
    }),
  },
  parameters: {
    notes: `
## Unverified (no badge)

User hasn't completed background check yet — badge is \`None\` and
both screening dates are null. The Buzz Badge card renders the em-dash
placeholder ("—") in both date rows so the layout doesn't shift once
Checkr eventually returns approved.
    `.trim(),
  },
};
