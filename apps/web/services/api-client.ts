export function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '';

  if (url) {
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      url.startsWith('http://') &&
      !url.includes('localhost') &&
      !url.includes('127.0.0.1')
    ) {
      url = url.replace('http://', 'https://');
    }
    return url.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location.hostname) {
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return 'http://localhost:8000';
    }
    // Production browser environment: use same origin or HTTPS protocol matching
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${window.location.hostname}`;
  }

  return 'http://localhost:8000';
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorBody || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const API_BASE_URL = getApiBaseUrl();
