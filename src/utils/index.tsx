import { history } from "@umijs/max";

export const GetHistoryQuery = () => {
  const query = {} as Record<string, string | undefined>;
  const search = new URLSearchParams(history.location.search);

  for (const [key, value] of search) {
    query[key] = value;
  }
  return query;
};
