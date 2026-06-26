// Mirror of the home feature's pattern in `home.types.ts`: re-export the
// generated fragment + enums so non-data-layer files don't reach into
// `graphql/generated` directly. Service + presentation files are
// lint-blocked from doing so; routing them through `models` keeps the
// boundary clean.
import {
  ViewerFriendshipState,
  type UserSearchResultFieldsFragment,
} from '../graphql/generated/search.generated';

export type SearchResultUser = UserSearchResultFieldsFragment;

export { ViewerFriendshipState };
