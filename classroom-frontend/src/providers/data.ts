import { BACKEND_BASE_URL } from '@/constants';
import type { ListResponse } from '@/types';
import { CreateResponse, HttpError } from '@refinedev/core';
import { createDataProvider, type CreateDataProviderOptions } from '@refinedev/rest';

if(!BACKEND_BASE_URL) {
  throw new Error('BACKEND_BASE_URL is not configured. Please set VITE_BACKEND_BASE_URL in your .env file.');
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed';

  try {
    const payload = (await response.json()) as { message?: string};

    if(payload?.message) message = payload.message;
  }
  catch {
    //ignore errors 
  }

  return {
    message,
    statusCode:response.status
  }
}

// Parse each Response body only once and reuse the parsed payload
const parsedListResponseCache = new WeakMap<Response, Promise<ListResponse>>();

const getParsedListResponse = (response: Response): Promise<ListResponse> => {
  const cached = parsedListResponseCache.get(response);
  if (cached) return cached;

  const parsed = response.json() as Promise<ListResponse>;
  parsedListResponseCache.set(response, parsed);
  return parsed;
};

const options: CreateDataProviderOptions = {
    getList: {
      getEndpoint: ({ resource }) => resource,

      buildQueryParams: async ({ resource, pagination, filters}) => {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        const params: Record<string, string | number> = { page, limit: pageSize};

        filters?.forEach((filter) => {
          const field = 'field' in filter ? filter.field: '';
          const value = String(filter.value);

          if(resource === 'subjects') {
            if(field === 'department') params.department = value;
            if(field === 'name' || field === 'code') params.search = value;
          }
        })
        return params;
      },

      mapResponse: async (response) => {
        if(!response.ok) throw await buildHttpError(response);
        
        const payload: ListResponse = await response.clone().json();
        return payload.data ?? [];
      },

      getTotalCount: async (response) => {
        if(!response.ok) throw await buildHttpError(response);

        const payload: ListResponse = await response.clone().json();
        return payload.pagination?.total ?? payload.data?.length ?? 0;
      }
    },
    create: {
      getEndpoint: ({ resource }) => resource,
      buildQueryParams: async ({ variables }) => variables,
      mapResponse: async (response) => {
        const json: CreateResponse = await response.json();

        return json.data ?? [];
      }
    }
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export {dataProvider};