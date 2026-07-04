/**
 * Stories for the My Profile body. Renders the actual `ProfileBody` —
 * the same component the connected `ProfileScreen` mounts in production.
 * No inline preview: the screen is a thin connected wrapper that reads
 * the auth session, wires up `useProfileForm` and `useContactForm`, and
 * threads them into the body.
 *
 * The body takes the two form bindings as objects with stub `setField`
 * / `submitField` callbacks — perfect for exercising the visual states
 * (empty vs filled inputs, success vs error status icons, empty vs
 * filled contact icons, disabled vs enabled connections switch, hidden
 * vs shared preview card). See `./ProfileBody.docs.md` for the full
 * anatomy.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { ProfileBody } from '../components/ProfileBody';

const emptyProfileValues = {
  nickname: '',
  handle: '',
} as const;

const emptyContactValues = {
  googleVoicePhone: '',
  whatsAppPhone: '',
  instagramHandle: '',
  telegramHandle: '',
  snapchatHandle: '',
  signalPhone: '',
} as const;

const idleProfileStatus = {
  nickname: 'idle',
  handle: 'idle',
} as const;

const idleContactStatus = {
  googleVoicePhone: 'idle',
  whatsAppPhone: 'idle',
  instagramHandle: 'idle',
  telegramHandle: 'idle',
  snapchatHandle: 'idle',
  signalPhone: 'idle',
} as const;

const noContactErrors = {
  googleVoicePhone: undefined,
  whatsAppPhone: undefined,
  instagramHandle: undefined,
  telegramHandle: undefined,
  snapchatHandle: undefined,
  signalPhone: undefined,
} as const;

const componentNotes = `
# ProfileBody

The My Profile surface reached from the account/menu drawer. Renders:

1. A preview card (or hidden placeholder) reflecting the user's Public /
   Private visibility.
2. The Profile section — avatar row, nickname + handle inputs with
   inline field-status icons, and the Share Profile privacy toggle.
3. A tip card asking users what fields they'd want next.
4. The Contact Information section — six brand-icon inputs (Google
   Voice, WhatsApp, Instagram, Telegram, Snapchat, Signal) with
   per-field error text and inline status icons, plus the "Share with
   connections" privacy toggle. The switch is disabled when the entire
   contact set is empty.

## Form bindings

The body takes two objects (\`profileForm\`, \`contactForm\`) so the
surface stays scannable — each bundle mirrors the shape returned by its
hook. The stories stub these with empty values and idle statuses; edit
individual fields inside the bundles via the JSON control if you want
to preview a specific state.

## Local state

The avatar picker sheet's open/closed flag is local to the body —
opening and closing is pure UI toggling with no side effects. Picking
an avatar fires \`onSelectAvatar\` and the sheet closes automatically.
`.trim();

const meta = {
  title: 'Account / ProfileBody',
  component: ProfileBody,
  args: {
    profileForm: {
      values: emptyProfileValues,
      fieldStatus: idleProfileStatus,
      setField: () => {},
      submitField: () => {},
    },
    contactForm: {
      values: emptyContactValues,
      fieldStatus: idleContactStatus,
      fieldError: noContactErrors,
      setField: () => {},
      submitField: () => {},
    },
    imageUrl: null,
    profileShared: true,
    connectionsOn: false,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGoBack: () => {},
    onOpenProfileDrawer: () => {},
    onSelectAvatar: () => {},
    onProfileSharedChange: () => {},
    onConnectionsChange: () => {},
  },
  argTypes: {
    imageUrl: { control: { type: 'text' } },
    profileShared: { control: { type: 'boolean' } },
    connectionsOn: { control: { type: 'boolean' } },
    onGoBack: { action: 'onGoBack' },
    onOpenProfileDrawer: { action: 'onOpenProfileDrawer' },
    onSelectAvatar: { action: 'onSelectAvatar' },
    onProfileSharedChange: { action: 'onProfileSharedChange' },
    onConnectionsChange: { action: 'onConnectionsChange' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfileBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  parameters: {
    notes: `
## Empty (default)

Brand-new user. No nickname, no handle, no contact info, no avatar. The
profile is Public (default enum value) so the preview card renders
above the empty form. The connections-only switch is disabled because
there's nothing to share yet.
    `.trim(),
  },
};

export const Filled: Story = {
  args: {
    profileForm: {
      values: { nickname: 'Jane', handle: 'jane' },
      fieldStatus: { nickname: 'success', handle: 'success' },
      setField: () => {},
      submitField: () => {},
    },
    contactForm: {
      values: {
        googleVoicePhone: '',
        whatsAppPhone: '(555) 987-6543',
        instagramHandle: 'janedoe',
        telegramHandle: '',
        snapchatHandle: 'janedoe',
        signalPhone: '',
      },
      fieldStatus: {
        googleVoicePhone: 'idle',
        whatsAppPhone: 'success',
        instagramHandle: 'success',
        telegramHandle: 'idle',
        snapchatHandle: 'success',
        signalPhone: 'idle',
      },
      fieldError: noContactErrors,
      setField: () => {},
      submitField: () => {},
    },
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=jane',
    profileShared: true,
    connectionsOn: true,
  },
  parameters: {
    notes: `
## Filled

Established user. Nickname + handle both saved (success ticks visible),
three contact channels populated, avatar picked, and the contact
share-with-connections switch is on — allowed because there's contact
info to share.
    `.trim(),
  },
};

export const ProfileHidden: Story = {
  args: { profileShared: false },
  parameters: {
    notes: `
## Profile hidden

User has toggled Share Profile off. The preview card swaps to
\`ProfilePreviewHiddenCard\` and the toggle copy switches to "Profile
hidden" / "Only I can see my profile."
    `.trim(),
  },
};

export const WithFieldError: Story = {
  args: {
    contactForm: {
      values: {
        ...emptyContactValues,
        googleVoicePhone: '(555) 1',
      },
      fieldStatus: { ...idleContactStatus, googleVoicePhone: 'error' },
      fieldError: {
        ...noContactErrors,
        googleVoicePhone: 'Enter a valid 10-digit phone number.',
      },
      setField: () => {},
      submitField: () => {},
    },
  },
  parameters: {
    notes: `
## With field error

User blurred a phone-style field with a partial value. The
\`FieldStatusIcon\` shows the error state and the inline error copy
renders under the input. In production this comes from
\`useContactForm\`'s validation branch — the field stays editable so
the user can correct it.
    `.trim(),
  },
};

export const AllInputsSuccess: Story = {
  args: {
    profileForm: {
      values: { nickname: 'Jane Doe', handle: 'janedoe' },
      fieldStatus: { nickname: 'success', handle: 'success' },
      setField: () => {},
      submitField: () => {},
    },
    contactForm: {
      values: {
        googleVoicePhone: '(555) 123-4567',
        whatsAppPhone: '(555) 987-6543',
        instagramHandle: 'janedoe',
        telegramHandle: 'janedoe',
        snapchatHandle: 'janedoe',
        signalPhone: 'https://signal.me/#eu/abc123',
      },
      fieldStatus: {
        googleVoicePhone: 'success',
        whatsAppPhone: 'success',
        instagramHandle: 'success',
        telegramHandle: 'success',
        snapchatHandle: 'success',
        signalPhone: 'success',
      },
      fieldError: noContactErrors,
      setField: () => {},
      submitField: () => {},
    },
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=jane',
    profileShared: true,
    connectionsOn: true,
  },
  parameters: {
    notes: `
## All inputs success

Every field (nickname, handle, and all 6 contact channels) is filled
with a valid value and reports \`fieldStatus === 'success'\` — every
row shows the green \`CircleCheck\`. Both privacy toggles are on and
allowed because the profile is Public and there's contact info to
share.

Use this to visually confirm the max-population layout: no cropping,
no wrapped labels, no gap regressions between rows.
    `.trim(),
  },
};

export const AllInputsError: Story = {
  args: {
    profileForm: {
      values: { nickname: 'Jane Doe', handle: 'janedoe' },
      // Server rejected both — e.g. handle taken, nickname flagged.
      fieldStatus: { nickname: 'error', handle: 'error' },
      setField: () => {},
      submitField: () => {},
    },
    contactForm: {
      values: {
        // Phone-style fields: partial digits fail client-side NANP validation.
        googleVoicePhone: '(555) 1',
        whatsAppPhone: '(555) 9',
        // Handle-style fields: server-side rejection (no client validation
        // for these — \`useContactForm\` only emits inline errors for phone
        // fields, so \`fieldError\` stays undefined and only the status
        // icon flips to error).
        instagramHandle: 'jane doe',
        telegramHandle: 'jane doe',
        snapchatHandle: 'jane doe',
        signalPhone: 'not-a-link',
      },
      fieldStatus: {
        googleVoicePhone: 'error',
        whatsAppPhone: 'error',
        instagramHandle: 'error',
        telegramHandle: 'error',
        snapchatHandle: 'error',
        signalPhone: 'error',
      },
      fieldError: {
        ...noContactErrors,
        googleVoicePhone: 'Enter a valid 10-digit phone number.',
        whatsAppPhone: 'Enter a valid 10-digit phone number.',
      },
      setField: () => {},
      submitField: () => {},
    },
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=jane',
    profileShared: true,
    connectionsOn: true,
  },
  parameters: {
    notes: `
## All inputs error

Every field is in the \`error\` state. Phone-style fields
(\`googleVoicePhone\`, \`whatsAppPhone\`) show the inline error message
under the input because \`useContactForm\` sets one for those. Handle
fields (\`instagramHandle\`, \`telegramHandle\`, \`snapchatHandle\`,
\`signalPhone\`) and the profile fields (\`nickname\`, \`handle\`) show
the error icon only — those errors originate server-side in
production, so the client doesn't own error copy for them.

Use this to sanity-check that the error icon column doesn't shift the
input width, and that the inline error text under phone fields doesn't
collide with the next row.
    `.trim(),
  },
};
