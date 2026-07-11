import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  AiFeedback,
  ContentRequest,
  FeedbackRequest,
  GeneratedContent,
  GetLeaderboardParams,
  GetStatsSummaryParams,
  GetStatsTrendsParams,
  HealthStatus,
  LeaderboardEntry,
  ListTypingTestsParams,
  PlatformStats,
  StatsSummary,
  TrendPoint,
  TypingTest,
  TypingTestInput,
} from "./api-types";

import { customFetch } from "./custom-fetch";
import type { BodyType, ErrorType } from "./custom-fetch";

export type {
  AiFeedback,
  ContentRequest,
  FeedbackRequest,
  GeneratedContent,
  GetLeaderboardParams,
  GetStatsSummaryParams,
  GetStatsTrendsParams,
  HealthStatus,
  LeaderboardEntry,
  ListTypingTestsParams,
  ModeStats,
  PlatformStats,
  StatsSummary,
  TrendPoint,
  TypingTest,
  TypingTestInput,
} from "./api-types";

export {
  ContentRequestDifficulty,
  GetLeaderboardPeriod,
} from "./api-types";

export { customFetch, setAuthTokenGetter, setBaseUrl, ApiError, ResponseParseError } from "./custom-fetch";
export type { ErrorType, BodyType } from "./custom-fetch";

type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

function buildUrl(base: string, params?: Record<string, unknown>): string {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `${base}?${stringifiedParams}` : base;
}

export const getHealthCheckUrl = () => "/api/healthz";

export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> => {
  return customFetch<HealthStatus>(getHealthCheckUrl(), {
    ...options,
    method: "GET",
  });
};

export const getHealthCheckQueryKey = () => ["/api/healthz"] as const;

export const getHealthCheckQueryOptions = <
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) =>
    healthCheck({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export function useHealthCheck<
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getListTypingTestsUrl = (params?: ListTypingTestsParams) =>
  buildUrl("/api/typing-tests", params);

export const listTypingTests = async (
  params?: ListTypingTestsParams,
  options?: RequestInit,
): Promise<TypingTest[]> => {
  return customFetch<TypingTest[]>(getListTypingTestsUrl(params), {
    ...options,
    method: "GET",
  });
};

export const getListTypingTestsQueryKey = (params?: ListTypingTestsParams) =>
  ["/api/typing-tests", ...(params ? [params] : [])] as const;

export const getListTypingTestsQueryOptions = <
  TData = Awaited<ReturnType<typeof listTypingTests>>,
  TError = ErrorType<unknown>,
>(
  params?: ListTypingTestsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTypingTests>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListTypingTestsQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listTypingTests>>> = ({ signal }) =>
    listTypingTests(params, { signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listTypingTests>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export function useListTypingTests<
  TData = Awaited<ReturnType<typeof listTypingTests>>,
  TError = ErrorType<unknown>,
>(
  params?: ListTypingTestsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTypingTests>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListTypingTestsQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getCreateTypingTestUrl = () => "/api/typing-tests";

export const createTypingTest = async (
  typingTestInput: TypingTestInput,
  options?: RequestInit,
): Promise<TypingTest> => {
  return customFetch<TypingTest>(getCreateTypingTestUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(typingTestInput),
  });
};

export const getCreateTypingTestMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createTypingTest>>,
      TError,
      { data: BodyType<TypingTestInput> },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseMutationOptions<
  Awaited<ReturnType<typeof createTypingTest>>,
  TError,
  { data: BodyType<TypingTestInput> },
  TContext
> => {
  const mutationKey = ["createTypingTest"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createTypingTest>>,
    { data: BodyType<TypingTestInput> }
  > = (props) => {
    const { data } = props ?? {};
    return createTypingTest(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export const useCreateTypingTest = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createTypingTest>>,
      TError,
      { data: BodyType<TypingTestInput> },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseMutationResult<
  Awaited<ReturnType<typeof createTypingTest>>,
  TError,
  { data: BodyType<TypingTestInput> },
  TContext
> => {
  return useMutation(getCreateTypingTestMutationOptions(options));
};

export const getGetTypingTestUrl = (id: number) => `/api/typing-tests/${id}`;

export const getTypingTest = async (id: number, options?: RequestInit): Promise<TypingTest> => {
  return customFetch<TypingTest>(getGetTypingTestUrl(id), {
    ...options,
    method: "GET",
  });
};

export const getGetTypingTestQueryKey = (id: number) => [`/api/typing-tests/${id}`] as const;

export const getGetTypingTestQueryOptions = <
  TData = Awaited<ReturnType<typeof getTypingTest>>,
  TError = ErrorType<void>,
>(
  id: number,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTypingTest>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTypingTestQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTypingTest>>> = ({ signal }) =>
    getTypingTest(id, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<Awaited<ReturnType<typeof getTypingTest>>, TError, TData> & {
    queryKey: QueryKey;
  };
};

export function useGetTypingTest<
  TData = Awaited<ReturnType<typeof getTypingTest>>,
  TError = ErrorType<void>,
>(
  id: number,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTypingTest>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetTypingTestQueryOptions(id, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetStatsSummaryUrl = (params?: GetStatsSummaryParams) =>
  buildUrl("/api/stats/summary", params);

export const getStatsSummary = async (
  params?: GetStatsSummaryParams,
  options?: RequestInit,
): Promise<StatsSummary> => {
  return customFetch<StatsSummary>(getGetStatsSummaryUrl(params), {
    ...options,
    method: "GET",
  });
};

export const getGetStatsSummaryQueryKey = (params?: GetStatsSummaryParams) =>
  ["/api/stats/summary", ...(params ? [params] : [])] as const;

export const getGetStatsSummaryQueryOptions = <
  TData = Awaited<ReturnType<typeof getStatsSummary>>,
  TError = ErrorType<unknown>,
>(
  params?: GetStatsSummaryParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetStatsSummaryQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getStatsSummary>>> = ({ signal }) =>
    getStatsSummary(params, { signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getStatsSummary>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export function useGetStatsSummary<
  TData = Awaited<ReturnType<typeof getStatsSummary>>,
  TError = ErrorType<unknown>,
>(
  params?: GetStatsSummaryParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetStatsSummaryQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetStatsTrendsUrl = (params?: GetStatsTrendsParams) =>
  buildUrl("/api/stats/trends", params);

export const getStatsTrends = async (
  params?: GetStatsTrendsParams,
  options?: RequestInit,
): Promise<TrendPoint[]> => {
  return customFetch<TrendPoint[]>(getGetStatsTrendsUrl(params), {
    ...options,
    method: "GET",
  });
};

export const getGetStatsTrendsQueryKey = (params?: GetStatsTrendsParams) =>
  ["/api/stats/trends", ...(params ? [params] : [])] as const;

export const getGetStatsTrendsQueryOptions = <
  TData = Awaited<ReturnType<typeof getStatsTrends>>,
  TError = ErrorType<unknown>,
>(
  params?: GetStatsTrendsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsTrends>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetStatsTrendsQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getStatsTrends>>> = ({ signal }) =>
    getStatsTrends(params, { signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getStatsTrends>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export function useGetStatsTrends<
  TData = Awaited<ReturnType<typeof getStatsTrends>>,
  TError = ErrorType<unknown>,
>(
  params?: GetStatsTrendsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsTrends>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetStatsTrendsQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetLeaderboardUrl = (params?: GetLeaderboardParams) =>
  buildUrl("/api/leaderboard", params);

export const getLeaderboard = async (
  params?: GetLeaderboardParams,
  options?: RequestInit,
): Promise<LeaderboardEntry[]> => {
  return customFetch<LeaderboardEntry[]>(getGetLeaderboardUrl(params), {
    ...options,
    method: "GET",
  });
};

export const getGetLeaderboardQueryKey = (params?: GetLeaderboardParams) =>
  ["/api/leaderboard", ...(params ? [params] : [])] as const;

export const getGetLeaderboardQueryOptions = <
  TData = Awaited<ReturnType<typeof getLeaderboard>>,
  TError = ErrorType<unknown>,
>(
  params?: GetLeaderboardParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetLeaderboardQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getLeaderboard>>> = ({ signal }) =>
    getLeaderboard(params, { signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getLeaderboard>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export function useGetLeaderboard<
  TData = Awaited<ReturnType<typeof getLeaderboard>>,
  TError = ErrorType<unknown>,
>(
  params?: GetLeaderboardParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetLeaderboardQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGenerateContentUrl = () => "/api/ai/generate-content";

export const generateContent = async (
  contentRequest: ContentRequest,
  options?: RequestInit,
): Promise<GeneratedContent> => {
  return customFetch<GeneratedContent>(getGenerateContentUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(contentRequest),
  });
};

export const getGenerateContentMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof generateContent>>,
      TError,
      { data: BodyType<ContentRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseMutationOptions<
  Awaited<ReturnType<typeof generateContent>>,
  TError,
  { data: BodyType<ContentRequest> },
  TContext
> => {
  const mutationKey = ["generateContent"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof generateContent>>,
    { data: BodyType<ContentRequest> }
  > = (props) => {
    const { data } = props ?? {};
    return generateContent(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export const useGenerateContent = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof generateContent>>,
      TError,
      { data: BodyType<ContentRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseMutationResult<
  Awaited<ReturnType<typeof generateContent>>,
  TError,
  { data: BodyType<ContentRequest> },
  TContext
> => {
  return useMutation(getGenerateContentMutationOptions(options));
};

export const getGenerateFeedbackUrl = () => "/api/ai/feedback";

export const generateFeedback = async (
  feedbackRequest: FeedbackRequest,
  options?: RequestInit,
): Promise<AiFeedback> => {
  return customFetch<AiFeedback>(getGenerateFeedbackUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(feedbackRequest),
  });
};

export const getGenerateFeedbackMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof generateFeedback>>,
      TError,
      { data: BodyType<FeedbackRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseMutationOptions<
  Awaited<ReturnType<typeof generateFeedback>>,
  TError,
  { data: BodyType<FeedbackRequest> },
  TContext
> => {
  const mutationKey = ["generateFeedback"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof generateFeedback>>,
    { data: BodyType<FeedbackRequest> }
  > = (props) => {
    const { data } = props ?? {};
    return generateFeedback(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export const useGenerateFeedback = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof generateFeedback>>,
      TError,
      { data: BodyType<FeedbackRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseMutationResult<
  Awaited<ReturnType<typeof generateFeedback>>,
  TError,
  { data: BodyType<FeedbackRequest> },
  TContext
> => {
  return useMutation(getGenerateFeedbackMutationOptions(options));
};

export const getGetPlatformStatsUrl = () => "/api/platform-stats";

export const getPlatformStats = async (options?: RequestInit): Promise<PlatformStats> => {
  return customFetch<PlatformStats>(getGetPlatformStatsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetPlatformStatsQueryKey = () => ["/api/platform-stats"] as const;

export const getGetPlatformStatsQueryOptions = <
  TData = Awaited<ReturnType<typeof getPlatformStats>>,
  TError = ErrorType<unknown>,
>(
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlatformStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetPlatformStatsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPlatformStats>>> = ({ signal }) =>
    getPlatformStats({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getPlatformStats>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export function useGetPlatformStats<
  TData = Awaited<ReturnType<typeof getPlatformStats>>,
  TError = ErrorType<unknown>,
>(
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlatformStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetPlatformStatsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}
