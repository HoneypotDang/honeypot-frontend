import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const INFO_GRAPH = process.env.NEXT_PUBLIC_INFO_GRAPH;
const BLOCKS_GRAPH = process.env.NEXT_PUBLIC_BLOCKS_GRAPH;
const FARMING_GRAPH = process.env.NEXT_PUBLIC_FARMING_GRAPH;

export const infoClient = new ApolloClient({
  uri: INFO_GRAPH,
  ssrMode: true,
  link: createHttpLink({
    uri: INFO_GRAPH,
    credentials: "same-origin",
    headers: {
      "apollographql-client-name": "info-graph",
    },
  }),
  cache: new InMemoryCache(),
});

export const blocksClient = new ApolloClient({
  uri: BLOCKS_GRAPH,
  cache: new InMemoryCache(),
});

export const farmingClient = new ApolloClient({
  uri: FARMING_GRAPH,
  cache: new InMemoryCache(),
});
