export type GraphQLRequest<TVariables> = {
  document: string;
  variables?: TVariables;
};

export const executeGraphQL = async <TData, TVariables = undefined>({
  document,
  variables,
}: GraphQLRequest<TVariables>): Promise<TData> => {
  void document;
  void variables;

  throw new Error(
    'GraphQL client is not configured yet. Add the shared GraphQL transport in src/lib/graphql/client.ts.',
  );
};
