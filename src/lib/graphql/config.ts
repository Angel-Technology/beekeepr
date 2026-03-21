import { environmentConfig } from '../config/environment';

export type GraphQLConfig = {
  baseURL: string;
};

export const graphQLConfig: GraphQLConfig = {
  baseURL: environmentConfig.graphQLBaseURL,
};

export const isGraphQLConfigured = graphQLConfig.baseURL.length > 0;
