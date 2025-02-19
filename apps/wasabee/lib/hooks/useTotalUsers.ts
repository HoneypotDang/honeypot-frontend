import { useQuery } from "@apollo/client";
import {
  DexAccountCountDocument,
  DexAccountCountQuery,
} from "../algebra/graphql/generated/graphql";

export function useTotalUsers() {
  const { data, loading, error } = useQuery<DexAccountCountQuery>(
    DexAccountCountDocument
  );

  return {
    totalUsers: data?.factories[0]?.accountCount ?? 0,
    loading,
    error,
  };
}
