import { useState } from 'react';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useSearchTab } from '../../hooks/useSearchTab';
import { SearchBody } from '../components/SearchBody';

/**
 * Connected wrapper for the Search tab. Owns the local `query` state so
 * the string can be fed into `useSearchTab` (which debounces + gates
 * lookups), owns the drawer-toggle side effect, and forwards every
 * hook output plus a menu-open callback into `SearchBody`.
 *
 * Query lives at the screen (not the body) so `useSearchTab` — a data
 * hook that can't run under Storybook — is the consumer. Keeping the
 * body prop-driven means stories can pass any fixture query without a
 * feedback loop.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what
 * the screen looks like, and Storybook renders that body directly.
 * Extracting the hook + navigation out of the presentation means
 * there's no parallel preview composition to keep in sync — same
 * pixels in production and in stories.
 */
export const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const {
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
  } = useSearchTab(query);

  return (
    <SearchBody
      query={query}
      onChangeQuery={setQuery}
      isResolving={isResolving}
      isDenied={isDenied}
      gateState={gateState}
      isSearchDisabled={isSearchDisabled}
      results={results}
      isLoading={isLoading}
      cancelPendingId={cancelPendingId}
      onPressUser={onPressUser}
      onUnsendInvite={onUnsendInvite}
      onAppealDecision={onAppealDecision}
      onGatePress={onGatePress}
      onOpenMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  );
};
