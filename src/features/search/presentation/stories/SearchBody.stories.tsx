/**
 * Stories for the Search tab body — the member-discovery surface reached
 * from the bottom-tab bar. Renders the actual `SearchBody`, the same
 * component the connected `SearchScreen` mounts in production. No inline
 * preview, no duplicated JSX: the screen owns local `query` state (so
 * `useSearchTab` can consume it) plus the drawer-toggle callback, and
 * forwards the hook outputs into this body. Storying the body is
 * equivalent to storying the screen minus the GraphQL + navigation
 * providers.
 *
 * Cover: `Idle`, `Typing` (below the 3-char floor), `Results`,
 * `NoResults`, `Loading` (initial resolve), `Denied` (background-check
 * banner + blocked input), plus the two gate variants (`GatedProfile`,
 * `GatedMember`). See `./SearchBody.docs.md` for anatomy + gating
 * priority.
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  BackgroundCheckBadge,
  ContactVisibility,
  ProfileVisibility,
} from '@features/auth';

import { SearchBody } from '../components/SearchBody';
import {
  ViewerFriendshipState,
  type SearchResultUser,
} from '../../models/search.types';

const makeResult = (
  id: string,
  nickname: string,
  handle: string,
  overrides: Partial<SearchResultUser> = {},
): SearchResultUser => ({
  id,
  nickname,
  displayName: nickname,
  handle,
  imageUrl: null,
  backgroundCheckBadge: BackgroundCheckBadge.Approved,
  backgroundCheckBadgeExpiresAtUtc: null,
  checkrLastCheckAtUtc: null,
  createdAtUtc: '2025-12-01T00:00:00Z',
  profileVisibility: ProfileVisibility.Public,
  contactVisibility: ContactVisibility.ConnectionsOnly,
  googleVoicePhone: null,
  whatsAppPhone: null,
  instagramHandle: null,
  telegramHandle: null,
  snapchatHandle: null,
  signalPhone: null,
  viewerFriendshipState: ViewerFriendshipState.None,
  ...overrides,
});

const FIXTURE_RESULTS: readonly SearchResultUser[] = [
  makeResult('u1', 'Ava', 'ava'),
  makeResult('u2', 'Ben', 'ben', {
    viewerFriendshipState: ViewerFriendshipState.RequestSent,
  }),
  makeResult('u3', 'Chloe', 'chloe', {
    backgroundCheckBadge: BackgroundCheckBadge.None,
  }),
];

const componentNotes = `
# SearchBody

The Search tab presentation body. Renders the header, the debounced
query input inside a \`FormCard\`, an optional gate CTA, and the
\`SearchResultsList\`.

## State-shaped variants

- **Idle** — \`query === ''\`. Input is empty, no result list yet.
- **Typing** — \`query.length < 3\`. Results list renders nothing until
  the query crosses the \`MIN_QUERY_LENGTH\` product floor (owned by the
  search feature, not shared).
- **Results** — \`query\` at or above the floor, hook returned rows.
- **NoResults** — query at floor, hook returned an empty array.
- **Loading** (initial resolve) — \`isResolving\`. Renders
  \`SearchScreenSkeleton\`.
- **Denied** — \`isDenied === true\`. Renders the
  \`BuzzScreeningDeniedCard\` above the input, disables the input, and
  hides results.

## Gate variants

- **GatedProfile** — \`gateState === 'profile'\`. User hasn't claimed a
  nickname / handle. Input is disabled; CTA routes to \`/profile\`.
- **GatedMember** — \`gateState === 'member'\`. Profile exists but the
  user isn't a subscriber. Input is disabled; CTA routes to
  \`/verify-learn-more\`.

Profile gate takes priority over member — a nameless user can't be
discovered, so pushing them through the membership purchase first
would be a dead end.

## Drawer inline actions

Search rows own inline actions: an approved-badge crest, a muted
badge for unverified members, or an Unsend button when the viewer
already sent an invite. Tapping a row opens the drawer preview via
\`onPressUser\`; tapping Unsend fires \`onUnsendInvite\`. The drawer's
Flag / Block / Invite header is driven by \`PreviewSource: 'search'\`
in the drawer preview store — that lives with the search feature, not
account.
`.trim();

const meta = {
  title: 'Search / SearchBody',
  component: SearchBody,
  args: {
    query: '',
    isResolving: false,
    isDenied: false,
    gateState: null,
    isSearchDisabled: false,
    results: [],
    isLoading: false,
    cancelPendingId: null,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onChangeQuery: () => {},
    onPressUser: () => {},
    onUnsendInvite: () => {},
    onAppealDecision: () => {},
    onGatePress: () => {},
    onOpenMenu: () => {},
  },
  argTypes: {
    query: { control: { type: 'text' } },
    isResolving: { control: { type: 'boolean' } },
    isDenied: { control: { type: 'boolean' } },
    gateState: {
      control: { type: 'radio' },
      options: [null, 'profile', 'member'],
    },
    isSearchDisabled: { control: { type: 'boolean' } },
    isLoading: { control: { type: 'boolean' } },
    onChangeQuery: { action: 'onChangeQuery' },
    onPressUser: { action: 'onPressUser' },
    onUnsendInvite: { action: 'onUnsendInvite' },
    onAppealDecision: { action: 'onAppealDecision' },
    onGatePress: { action: 'onGatePress' },
    onOpenMenu: { action: 'onOpenMenu' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof SearchBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { query: '' },
  parameters: {
    notes: `
## Idle (default)

Nothing typed yet. Input shows the placeholder, results list is
suppressed. The default landing state on the Search tab.
    `.trim(),
  },
};

export const Typing: Story = {
  args: { query: 'ab', results: [], isLoading: false },
  parameters: {
    notes: `
## Typing (below floor)

Query is 1–2 characters. Below \`MIN_QUERY_LENGTH = 3\`, the results
list renders nothing at all — no "No members found" flash while the
user is still typing the third character.
    `.trim(),
  },
};

export const Results: Story = {
  args: { query: 'ava', results: FIXTURE_RESULTS, isLoading: false },
  parameters: {
    notes: `
## Results

Three rows, one each of: approved badge, request-sent (with Unsend
button), and unverified member (muted badge). Tap a row to fire
\`onPressUser\`; tap Unsend to fire \`onUnsendInvite\`.
    `.trim(),
  },
};

export const NoResults: Story = {
  args: { query: 'zzz', results: [], isLoading: false },
  parameters: {
    notes: `
## No results

Query is at or above the floor but the backend returned no matches.
Renders the "No members found" message from \`SearchResultsList\`.
    `.trim(),
  },
};

export const Loading: Story = {
  args: { isResolving: true },
  parameters: {
    notes: `
## Loading (resolving)

Auth session + RevenueCat customer info haven't resolved yet.
\`SearchScreenSkeleton\` mirrors the resting layout so the swap
doesn't shift content.
    `.trim(),
  },
};

export const ResultsLoading: Story = {
  args: { query: 'ava', results: [], isLoading: true },
  parameters: {
    notes: `
## Results loading

Query at floor, network in flight. Renders the row-level shimmer via
\`SearchResultsSkeleton\` under the input.
    `.trim(),
  },
};

export const Denied: Story = {
  args: { isDenied: true, isSearchDisabled: true },
  parameters: {
    notes: `
## Denied (banner + blocked)

Terminal Persona / Checkr denial. Renders \`BuzzScreeningDeniedCard\`
above the input, disables the input, and hides results — denied users
don't get to browse the community. In production this pairing is
automatic: \`useSearchTab\` folds \`isDenied\` into \`isSearchDisabled\`
so any code path that flips \`isDenied\` also flips the disable.

The in-card copy ("Only members have access to the Buzz Badge
community.") is rendered by \`SearchBody\` whenever \`isDenied\` is
true, giving the disabled input an inline reason.
    `.trim(),
  },
};

export const GatedProfile: Story = {
  args: { gateState: 'profile', isSearchDisabled: true },
  parameters: {
    notes: `
## Gated — profile

User hasn't claimed a nickname / handle. Input is disabled + the
gate copy + CTA render inside the \`FormCard\`. CTA routes to
\`/profile\` in production.
    `.trim(),
  },
};

export const GatedMember: Story = {
  args: { gateState: 'member', isSearchDisabled: true },
  parameters: {
    notes: `
## Gated — member

Profile exists but the user isn't a Buzz Badge subscriber. Input is
disabled + the gate copy + CTA render inside the \`FormCard\`. CTA
routes to \`/verify-learn-more\` in production.
    `.trim(),
  },
};
