/**
 * Stories for the shared `<ProfilePreviewBody />` — the body every
 * drawer that previews a profile mounts inline (own profile,
 * connection preview, search preview). No header, no actions — those
 * live in the consumer because they vary per drawer variant. This body
 * owns everything below the header: avatar + nickname + handle row,
 * the Buzz Badge summary card, the optional contact-information card
 * (visible only when the user shares contacts with connections), and
 * the safety disclaimer.
 *
 * Every meaningful data axis is exercised: verified vs unverified vs
 * denied badge, private vs public profile, hidden contact vs
 * minimal-contact vs all-contact-methods, and the no-avatar fallback.
 * See `./ProfilePreviewBody.docs.md` for anatomy, prop table, and the
 * gating rule that drives whether the contact card renders.
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import {
  BackgroundCheckBadge,
  ContactVisibility,
  ProfileVisibility,
} from '@features/auth';

import { ErrorModalProvider } from '@src/lib/error-modal/ErrorModalProvider';

import { ProfilePreviewBody } from './ProfilePreviewBody';
import type { ProfilePreviewUser } from './types';

const makeUser = (
  overrides: Partial<ProfilePreviewUser> = {},
): ProfilePreviewUser => ({
  id: 'u-1',
  nickname: 'Ava',
  displayName: 'Ava',
  handle: 'ava',
  imageUrl: null,
  backgroundCheckBadge: BackgroundCheckBadge.Approved,
  backgroundCheckBadgeExpiresAtUtc: '2026-07-01T00:00:00Z',
  checkrLastCheckAtUtc: '2026-01-01T00:00:00Z',
  userCreatedAtUtc: '2025-06-01T00:00:00Z',
  profileVisibility: ProfileVisibility.Public,
  contactVisibility: ContactVisibility.ConnectionsOnly,
  googleVoicePhone: null,
  whatsAppPhone: null,
  instagramHandle: null,
  telegramHandle: null,
  snapchatHandle: null,
  signalPhone: null,
  ...overrides,
});

const componentNotes = `
# ProfilePreviewBody

Shared body for every drawer that previews a profile:

- \`ProfileDrawerContent\` — the viewer's own profile.
- \`ConnectionPreviewDrawerContent\` — a friend / connection.
- The search-tab drawer preview.

The header (title / kebab / actions row) lives in each drawer because
those vary per source. Everything below the header — the avatar +
nickname + handle row, the Buzz Badge summary card, the optional
contact card, and the safety disclaimer — is shared here.

## Fixture axes covered by the stories

- **Verified** — \`backgroundCheckBadge = Approved\`. Default.
- **Unverified** — \`backgroundCheckBadge = None\`.
- **Denied** — \`backgroundCheckBadge = Denied\`.
- **PrivateProfile** — \`profileVisibility = Private\`. Drawer
  callers replace the preview card upstream; this body renders
  regardless because the drawer is only reachable when the viewer is
  allowed to see the profile.
- **MinimalContact** — one contact method (phone).
- **AllContactMethods** — every contact channel filled.
- **NoAvatar** — \`imageUrl = null\` renders the fallback icon.

## Contact card gating

The Contact Information card only renders when **both**:

1. \`contactVisibility === ContactVisibility.ConnectionsOnly\`, and
2. At least one contact field on the user is non-empty.

Flipping \`contactVisibility\` to \`Private\` (or emptying every contact
field) hides the card. The Buzz Badge summary and the safety
disclaimer always render.

## Callback

\`onScrollBeginDrag\` fires from the inner scroll view's first drag —
consumers like \`ConnectionPreviewDrawerContent\` wire it to close the
kebab actions menu, so scrolling the body dismisses the dropdown.
`.trim();

const meta = {
  title: 'Profile Preview / ProfilePreviewBody',
  component: ProfilePreviewBody,
  decorators: [
    (Story) => (
      <ErrorModalProvider>
        <View className="flex-1">
          <Story />
        </View>
      </ErrorModalProvider>
    ),
  ],
  args: {
    user: makeUser(),
    // Storybook's action addon replaces this at render time via the
    // `argTypes.action` declaration below — the stub satisfies TS.
    onScrollBeginDrag: () => {},
  },
  argTypes: {
    onScrollBeginDrag: { action: 'onScrollBeginDrag' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfilePreviewBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Verified: Story = {
  args: {
    user: makeUser({
      backgroundCheckBadge: BackgroundCheckBadge.Approved,
      snapchatHandle: 'ava',
    }),
  },
  parameters: {
    notes: `
## Verified (default)

Approved Buzz Badge with a last-screened and next-screening date. One
contact channel (Snapchat) is filled, contact sharing is on, so the
Contact Information card renders below the badge summary.
    `.trim(),
  },
};

export const Unverified: Story = {
  args: {
    user: makeUser({
      backgroundCheckBadge: BackgroundCheckBadge.None,
      backgroundCheckBadgeExpiresAtUtc: null,
      checkrLastCheckAtUtc: null,
    }),
  },
  parameters: {
    notes: `
## Unverified

User has never completed a background check. \`backgroundCheckBadge\`
is \`None\`, and both screening dates render as em-dashes because no
check has ever run. Contact info is empty so the contact card is
suppressed even though sharing is on.
    `.trim(),
  },
};

export const Denied: Story = {
  args: {
    user: makeUser({
      backgroundCheckBadge: BackgroundCheckBadge.Denied,
      checkrLastCheckAtUtc: '2026-03-15T00:00:00Z',
      backgroundCheckBadgeExpiresAtUtc: null,
    }),
  },
  parameters: {
    notes: `
## Denied

Terminal Checkr denial. The last-screened date reflects when the
denial happened; next-screening stays as an em-dash because denied
users don't get a re-check window.

Note: this body renders the raw badge card regardless of denial —
higher-level drawer callers may swap this body out entirely for
denied viewers, but a friend viewing a denied member still sees the
badge state here.
    `.trim(),
  },
};

export const PrivateProfile: Story = {
  args: {
    user: makeUser({
      profileVisibility: ProfileVisibility.Private,
      contactVisibility: ContactVisibility.Private,
      snapchatHandle: 'ava',
      whatsAppPhone: '5559876543',
    }),
  },
  parameters: {
    notes: `
## Private profile

\`profileVisibility = Private\` and \`contactVisibility = Private\`.
Even though this fixture has contact methods populated, the contact
card is suppressed because sharing is off. In production the drawer
consumer typically doesn't open this body for a private profile at
all — \`ProfilePreviewHiddenCard\` gates access upstream. This story
covers the safety net if the body ever gets rendered.
    `.trim(),
  },
};

export const MinimalContact: Story = {
  args: {
    user: makeUser({
      snapchatHandle: 'ava',
    }),
  },
  parameters: {
    notes: `
## Minimal contact

Sharing is on, one contact method (Snapchat) is filled. The Contact
Information card renders a single tappable row that opens the
Snapchat add-friend link.
    `.trim(),
  },
};

export const AllContactMethods: Story = {
  args: {
    user: makeUser({
      googleVoicePhone: '5559876543',
      whatsAppPhone: '5551112222',
      instagramHandle: 'ava',
      telegramHandle: 'ava_tg',
      snapchatHandle: 'ava_snap',
      signalPhone: '5553334444',
    }),
  },
  parameters: {
    notes: `
## All contact methods

Every contact channel is filled. Rendered in the source-file order:
Google Voice, WhatsApp, Instagram, Telegram, Snapchat, Signal. Signal
and Snapchat use the pill-shaped "Profile link" button per Figma
because those handles resolve to opaque profile URLs, not typeable
identifiers.

**Try this:** tap any row in the canvas — \`Linking.openURL\` is
invoked with the corresponding deep link (\`tel:\`, \`https://wa.me/\`,
\`https://instagram.com/\`, etc.).
    `.trim(),
  },
};

export const NoAvatar: Story = {
  args: {
    user: makeUser({ imageUrl: null }),
  },
  parameters: {
    notes: `
## No avatar

\`imageUrl\` is null (or a non-SVG URL like Google's rasterised
\`picture\` field, which \`isRenderableAvatarUrl\` rejects). Falls back
to the neutral \`UserRound\` icon inside the avatar circle.
    `.trim(),
  },
};
