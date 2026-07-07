import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Menu, Search as SearchIcon, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppHeader,
  BOTTOM_TAB_BAR_HEIGHT,
  CompactButton,
  FormCard,
  IconButton,
  Input,
} from '@components';
import { InfoSection } from '@features/account';
import { BuzzScreeningDeniedCard } from '@features/home/presentation/components';
import { themedColors, useThemedColor } from '@common';
// eslint-disable-next-line no-restricted-imports
import type { SearchGateState } from '../../hooks/useSearchTab';
import type { SearchResultUser } from '../../models/search.types';
import { SearchResultsList } from './SearchResultsList';
import { SearchScreenSkeleton } from './SearchScreenSkeleton';

const GATE_COPY: Record<Exclude<SearchGateState, null>, string> = {
  profile:
    'Create a profile to search for members in the Buzz Badge community.',
  member: 'Only Buzz Badge members have access.',
};

const GATE_CTA: Record<Exclude<SearchGateState, null>, string> = {
  profile: 'Create a profile',
  member: 'Become a member',
};

type SearchBodyProps = {
  /** Current text in the search input. */
  query: string;
  /** Fires on each keystroke; the parent hook consumes this. */
  onChangeQuery: (next: string) => void;
  /**
   * True while the auth session + RevenueCat customer info are still
   * resolving. Renders `SearchScreenSkeleton` and suppresses everything
   * else.
   */
  isResolving: boolean;
  /**
   * True for terminal Persona-declined / Checkr-denied users. Renders
   * the `BuzzScreeningDeniedCard` at the top of the scroll and — in
   * concert with `isSearchDisabled` — blocks the input + hides results
   * (denied users don't get to browse the community).
   */
  isDenied: boolean;
  /**
   * Which gate (if any) blocks the user from searching. `profile` fires
   * first — a nameless account can't be discovered so pushing them to
   * membership would be a dead end.
   */
  gateState: SearchGateState;
  /**
   * True when either gate is active OR the user is denied. Disables
   * the input + hides results.
   */
  isSearchDisabled: boolean;
  results: readonly SearchResultUser[];
  isLoading: boolean;
  /** ID of the invite currently being unsent, or `null`. */
  cancelPendingId: string | null;
  /** Row press → opens the drawer preview via the parent. */
  onPressUser: (user: SearchResultUser) => void;
  /** Unsend button on a row where the viewer already sent an invite. */
  onUnsendInvite: (userId: string) => void;
  /** Denied-card "Contact Support". Wraps `openInAppBrowser` in prod. */
  onAppealDecision: () => void;
  /** Gate CTA press — parent routes to `/profile` or `/verify-learn-more`. */
  onGatePress: () => void;
  /** Hamburger tap → toggles the right-side drawer. */
  onOpenMenu: () => void;
};

/**
 * Pure presentation body for the Search tab. Renders the `AppHeader`,
 * the debounced-query input inside a `FormCard`, optional gate copy +
 * CTA, and the `SearchResultsList`. All lookup + gating logic lives
 * upstream in `useSearchTab` — this component only draws.
 *
 * Reads no feature hooks — only theming (`useThemedColor`) and safe-area
 * (`useSafeAreaInsets`) helpers. The connected `SearchScreen` owns the
 * local `query` state (so the hook can consume it), calls `useSearchTab`,
 * and forwards its outputs plus a navigation callback into this body.
 * Stories render this body directly with fixture data — no router,
 * TanStack Query, or GraphQL provider mocks needed.
 *
 * Drawer-inline actions live in the row components (`SearchResultRow`
 * renders the Unsend button; the drawer's Flag/Block/Invite header is
 * driven by `PreviewSource: 'search'` in the drawer preview store).
 */
export const SearchBody = ({
  query,
  onChangeQuery,
  isResolving,
  isDenied,
  gateState,
  isSearchDisabled,
  results,
  isLoading,
  cancelPendingId,
  onPressUser,
  onUnsendInvite,
  onAppealDecision,
  onGatePress,
  onOpenMenu,
}: SearchBodyProps) => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);
  const placeholderColor = useThemedColor(themedColors.text.tertiary);

  return (
    <View className="flex-1 bg-tk-bg-primary">
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="font-poppins-semiBold text-base text-tk-text-primary">
            Search
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} color={iconColor} />}
            onPress={onOpenMenu}
          />
        }
      />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 16,
          gap: 24,
        }}
      >
        {isResolving ? (
          <SearchScreenSkeleton />
        ) : (
          <>
            {isDenied ? (
              <BuzzScreeningDeniedCard onAppealDecision={onAppealDecision} />
            ) : null}
            <InfoSection title="BUZZ BADGE COMMUNITY">
              <FormCard>
                <Input
                  label="Search members"
                  placeholder="@handle123, Nickname 123"
                  value={query}
                  onChangeText={onChangeQuery}
                  disabled={isSearchDisabled}
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftAccessory={
                    <SearchIcon size={20} color={placeholderColor} />
                  }
                  rightAccessory={
                    !isSearchDisabled && query.length > 0 ? (
                      <TouchableOpacity
                        accessibilityLabel="Clear search"
                        onPress={() => onChangeQuery('')}
                        hitSlop={8}
                      >
                        <X size={20} color={iconColor} />
                      </TouchableOpacity>
                    ) : undefined
                  }
                />
                {gateState ? (
                  <>
                    <Text
                      className="font-lexend-regular text-base leading-6 text-tk-text-secondary"
                      style={{ letterSpacing: -0.3 }}
                    >
                      {GATE_COPY[gateState]}
                    </Text>
                    <CompactButton
                      label={GATE_CTA[gateState]}
                      onPress={onGatePress}
                    />
                  </>
                ) : null}
                {isDenied ? (
                  <Text
                    className="font-lexend-regular text-base leading-6 text-tk-text-secondary"
                    style={{ letterSpacing: -0.3 }}
                  >
                    Only members have access to the Buzz Badge community.
                  </Text>
                ) : null}
              </FormCard>
            </InfoSection>
            {isSearchDisabled ? null : (
              <SearchResultsList
                query={query}
                results={results}
                isLoading={isLoading}
                cancelPendingId={cancelPendingId}
                onPressUser={onPressUser}
                onUnsendInvite={onUnsendInvite}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export type { SearchBodyProps };
