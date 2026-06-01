const API_BASE_URL =
  process.env.FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL;

type EndpointCandidate = {
  basePath: string;
  path: string;
};

type CollectionPayload<T> =
  | {
      success?: boolean;
      data?: T[];
      pagination?: Partial<PaginationMeta>;
    }
  | T[];

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return null;
  }

  return new URL(path, API_BASE_URL).toString();
}

export function withQuery(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export async function fetchJson<T>(path: string) {
  const url = buildApiUrl(path);

  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json().catch(() => null)) as T | null;
  } catch {
    return null;
  }
}

function isPaginationMeta(value: unknown): value is Partial<PaginationMeta> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toPaginationMeta(
  value: unknown,
  total: number,
  limit: number,
  page: number,
): PaginationMeta {
  if (isPaginationMeta(value)) {
    const normalizedLimit = Number(value.limit ?? limit) || limit;
    const normalizedTotal = Number(value.total ?? total) || total;
    const normalizedPage = Number(value.page ?? page) || page;
    const normalizedTotalPages =
      Number(value.totalPages ?? Math.ceil(normalizedTotal / normalizedLimit)) || 1;

    return {
      page: Math.max(1, normalizedPage),
      limit: Math.max(1, normalizedLimit),
      total: Math.max(0, normalizedTotal),
      totalPages: Math.max(1, normalizedTotalPages),
    };
  }

  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function extractRecords<T>(payload: CollectionPayload<T> | null) {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload.success === false || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data;
}

async function fetchFirstAvailable<T>(candidates: EndpointCandidate[]) {
  for (const candidate of candidates) {
    const payload = await fetchJson<T>(candidate.path);

    if (payload !== null) {
      return {
        basePath: candidate.basePath,
        payload,
      };
    }
  }

  return null;
}

export async function fetchAllCollectionRecords<T>(
  basePaths: string[],
  options: {
    limit?: number;
    query?: Record<string, string | number | undefined>;
  } = {},
) {
  const limit = options.limit ?? 100;
  const firstPageCandidates = basePaths.map((basePath) => ({
    basePath,
    path: withQuery(basePath, { page: 1, limit, ...options.query }),
  }));
  const firstPage = await fetchFirstAvailable<CollectionPayload<T>>(firstPageCandidates);

  if (!firstPage) {
    return [] as T[];
  }

  const initialRecords = extractRecords(firstPage.payload);

  if (Array.isArray(firstPage.payload)) {
    return initialRecords;
  }

  const pagination = toPaginationMeta(
    firstPage.payload.pagination,
    initialRecords.length,
    limit,
    1,
  );

  if (pagination.totalPages <= 1) {
    return initialRecords;
  }

  const records = [...initialRecords];

  for (let currentPage = 2; currentPage <= pagination.totalPages; currentPage += 1) {
    const nextPage = await fetchJson<CollectionPayload<T>>(
      withQuery(firstPage.basePath, {
        page: currentPage,
        limit: pagination.limit,
        ...options.query,
      }),
    );

    records.push(...extractRecords(nextPage));
  }

  return records;
}

export function paginateCollection<T>(
  records: T[],
  requestedPage: number,
  limit: number,
) {
  const safeLimit = Math.max(1, limit);
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * safeLimit;

  return {
    data: records.slice(start, start + safeLimit),
    pagination: {
      page,
      limit: safeLimit,
      total,
      totalPages,
    } satisfies PaginationMeta,
  };
}

export function parsePageParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}
