import type { CodegenConfig } from "@graphql-codegen/cli";
import { QueryClient } from "@tanstack/react-query";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "https://api.goldsky.com/api/public/project_cm0keevd9v59l01w4fokhdcg9/subgraphs/hpot-algebra-core/2.1.0/gn",
    "https://api.studio.thegraph.com/query/50593/goerli-blocks/version/latest",
    "https://api.goldsky.com/api/public/project_cm0keevd9v59l01w4fokhdcg9/subgraphs/hpot-algebra-farming/1.0.0/gn",
  ],
  documents: "lib/algebra/graphql/queries/!(*.d).{ts,tsx}",
  generates: {
    "lib/algebra/graphql/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withResultType: true,
        addQuery: true,
        addInfiniteQuery: true,
        addPagination: true,
        addInlineFragment: true,
      },
    },
  },
};

export default config;
