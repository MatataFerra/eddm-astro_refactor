import type { Article } from '@/lib/interfaces/articles';
import { generateToken } from '@/lib/jwt';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
type AvailableFields<T> = Exclude<keyof T, 'cover' | 'header' | 'media' | 'blocks'>;
type Fields<T> = Array<AvailableFields<T>> | AvailableFields<T>;
type Url = string;
type Flat = string | number | boolean;
type ParamValue = Flat | Flat[] | Record<string, unknown>;

type FetchOptions = {
  method?: Methods;
  params?: Record<string, ParamValue>;
  fields?: Fields<Article>;
  isExternalUrl?: boolean;
  headers?: Record<string, string>;
};

export type ApiResponse<T> = {
  data: T;
  ok?: boolean;
  metadata: {
    message: string;
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
};

function formatFields(fields?: Fields<Article>): string | undefined {
  if (!fields) return undefined;

  if (Array.isArray(fields)) {
    return fields.map((field) => String(field)).join(',');
  }

  return String(fields);
}

const formatParams = (params: Record<string, ParamValue>): Record<string, string> => {
  const formatted: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formatted[key] = value.join(',');
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        formatted[`${key}[${subKey}]`] = String(subValue);
      });
    } else {
      formatted[key] = String(value);
    }
  });
  return formatted;
};

const AUTH = (() => {
  return `Bearer ${generateToken({
    user: import.meta.env.TOKEN_USER,
    password: import.meta.env.TOKEN_PASSWORD,
  })}`;
})();

async function _fetchData<T>(url: Url, opts: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { params = {}, method = 'GET', isExternalUrl = false, fields, headers } = opts;

  const formattedFields = formatFields(fields);
  const mergedParams: Record<string, ParamValue> = {
    ...params,
    ...(formattedFields && params.fields === undefined ? { fields: formattedFields } : {}),
  };

  const qs = new URLSearchParams(formatParams(mergedParams)).toString();

  const base = isExternalUrl ? String(url) : `${import.meta.env.API_URL}/api${url}`;

  const fullUrl = qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base;

  const res = await fetch(fullUrl, {
    method,
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
      'x-debug-req-id': `ID-From_Astro-${Math.random().toString(36).substring(2, 15)}`,
      ...headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Error en ${method} ${url}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const fetchData = <T>(url: Url, opts?: FetchOptions) => _fetchData<T>(url, opts);
