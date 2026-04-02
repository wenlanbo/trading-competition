import { GraphQLClient } from 'graphql-request'

export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ||
    'http://localhost:8080/v1/graphql',
  {
    headers: () => {
      const headers: Record<string, string> = {}

      if (process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET) {
        headers['x-hasura-admin-secret'] =
          process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
      }

      return headers
    },
  }
)
