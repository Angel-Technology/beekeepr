import { GraphQLClient } from 'graphql-request';
import type { RequestOptions, Variables } from 'graphql-request';
import { tokenStorage } from '../auth/tokenStorage';
import { graphQLConfig, isGraphQLConfigured } from './config';

export type ExecuteGraphQLOptions<
  TData,
  TVariables extends Variables,
> = RequestOptions<TVariables, TData>;

const createGraphQLClient = () => {
  return new GraphQLClient(graphQLConfig.baseURL, {
    // eslint-disable-next-line no-undef
    fetch,
  });
};

export const executeGraphQL = async <
  TData,
  TVariables extends Variables = Variables,
>({
  document,
  ...options
}: ExecuteGraphQLOptions<TData, TVariables>): Promise<TData> => {
  if (!isGraphQLConfigured) {
    throw new Error('GraphQL backend is not configured yet.');
  }

  const client = createGraphQLClient();
  const token = await tokenStorage.getToken();
  const requestOptions = {
    document,
    requestHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.requestHeaders,
    },
    ...options,
  } as RequestOptions<TVariables, TData>;

  return client.request<TData, TVariables>(requestOptions);
};
