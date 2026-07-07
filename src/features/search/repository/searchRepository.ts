import { executeGraphQL } from '@src/lib/graphql/client';
import {
  SearchUsersDocument,
  type SearchUsersQuery,
  type SearchUsersQueryVariables,
} from '../graphql/generated/search.generated';

export const searchRepository = {
  searchUsers(variables: SearchUsersQueryVariables) {
    return executeGraphQL<SearchUsersQuery, SearchUsersQueryVariables>({
      document: SearchUsersDocument,
      variables,
    });
  },
};
