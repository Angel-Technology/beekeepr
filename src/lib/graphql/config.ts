export type GraphQLConfig = {
  baseURL: string;
};

export const graphQLConfig: GraphQLConfig = {
  baseURL: process.env.EXPO_PUBLIC_GRAPHQL_URL ?? '',
};

export const isGraphQLConfigured = graphQLConfig.baseURL.length > 0;
