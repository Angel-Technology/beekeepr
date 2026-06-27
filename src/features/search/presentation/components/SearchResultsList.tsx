import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { MIN_QUERY_LENGTH } from '../../models/searchConstants';
import type { SearchResultUser } from '../../models/search.types';
import { SearchResultRow } from './SearchResultRow';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';

type SearchResultsListProps = {
  query: string;
  results: readonly SearchResultUser[];
  isLoading: boolean;
  cancelPendingId: string | null;
  onPressUser: (user: SearchResultUser) => void;
  onUnsendInvite: (userId: string) => void;
};

export const SearchResultsList = ({
  query,
  results,
  isLoading,
  cancelPendingId,
  onPressUser,
  onUnsendInvite,
}: SearchResultsListProps) => {
  // Below the min-query gate, render nothing — the empty Search card
  // stands on its own (matches the Figma "empty" state) and we don't
  // flash "No members found" while the user is still typing the third
  // character.
  if (query.trim().length < MIN_QUERY_LENGTH) {
    return null;
  }

  if (isLoading) {
    return <SearchResultsSkeleton />;
  }
  if (results.length === 0) {
    return (
      <View className="px-1">
        <Text className="text-tk-text-secondary font-lexend-regular text-footnote">
          No members found.
        </Text>
      </View>
    );
  }
  return (
    <View className="self-stretch">
      {results.map((user, index) => (
        <Fragment key={user.id}>
          {index > 0 ? (
            <View className="bg-tk-border-secondary h-px w-full" />
          ) : null}
          <SearchResultRow
            user={user}
            onPress={onPressUser}
            onUnsendInvite={onUnsendInvite}
            isUnsending={cancelPendingId === user.id}
          />
        </Fragment>
      ))}
    </View>
  );
};
