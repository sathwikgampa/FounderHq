/**
 * Authenticated API Client
 * -------------------------
 * WHY THESE CHANGES:
 *
 * 1. Firebase token injection (Task 10)
 *    The previous client made every request unauthenticated — no Authorization
 *    header was ever attached, so the backend JWT middleware was bypassed for
 *    all API calls. This version retrieves the current Firebase ID token before
 *    each request and injects it as a Bearer token. The token is refreshed
 *    automatically by the Firebase SDK when it approaches expiry.
 *
 * 2. CSRF protection (Task 15)
 *    For state-changing requests (POST/PUT/PATCH/DELETE) we attach two headers:
 *      - X-Requested-With: XMLHttpRequest
 *        This is the standard "same-origin" signal checked by many frameworks.
 *        Browsers include it automatically for XHR/fetch from same-origin pages
 *        but NOT for simple cross-origin form submissions, which is how CSRF
 *        attacks usually operate.
 *      - X-CSRF-Token: <session-derived token>
 *        We generate a per-session CSRF token using the Web Crypto API and store
 *        it in sessionStorage (not localStorage — shorter lifetime, not accessible
 *        cross-tab, wiped on tab close). The backend middleware.ts (task 13) can
 *        validate this header on state-changing requests.
 *
 * 3. Structured error handling
 *    API errors are now parsed as JSON (using the APIResponseEnvelope format from
 *    the backend) so callers get a typed error message rather than a raw string.
 *
 * 4. Demo mode passthrough
 *    When the user is in demo mode (isDemo === true) the token is the mock string
 *    "mock_demo_bearer_token". The client detects this and sends it as-is so the
 *    dev-mode backend bypass in jwt_auth.py still works.
 */

import { auth } from '@/lib/firebase';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// ---------------------------------------------------------------------------
// CSRF token — generated once per browser session
// ---------------------------------------------------------------------------

const CSRF_SESSION_KEY = 'fhq_csrf_token';

function getCsrfToken(): string {
  if (typeof window === 'undefined') return ''; // SSR guard

  let token = sessionStorage.getItem(CSRF_SESSION_KEY);
  if (!token) {
    // Generate a cryptographically random 32-byte token
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    token = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem(CSRF_SESSION_KEY, token);
  }
  return token;
}

// ---------------------------------------------------------------------------
// Firebase token retrieval
// ---------------------------------------------------------------------------

/**
 * Retrieve a fresh Firebase ID token for the currently signed-in user.
 * Returns null when no user is signed in (unauthenticated requests).
 *
 * The `forceRefresh: false` argument means Firebase only calls the token
 * endpoint when the token is within 5 minutes of expiry — very cheap.
 */
async function getFirebaseToken(): Promise<string | null> {
  if (!auth) return null;
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken(/* forceRefresh */ false);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = (options.method ?? 'GET').toUpperCase();

  // ── 1. Retrieve auth token ──────────────────────────────────────────────
  const token = await getFirebaseToken();

  // ── 2. Build headers ────────────────────────────────────────────────────
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Standard signal that this is a programmatic (same-origin) request.
    // Prevents CSRF via simple cross-origin form submissions.
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Attach Bearer token when available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Attach CSRF token for all state-changing requests
  if (STATE_CHANGING_METHODS.has(method)) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }

  // Merge caller-supplied headers last so they can override if needed
  const mergedHeaders = {
    ...headers,
    ...(options.headers as Record<string, string> | undefined),
  };

  // ── 3. Execute request ──────────────────────────────────────────────────
  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  // ── 4. Handle errors ────────────────────────────────────────────────────
  if (!response.ok) {
    let code = 'API_ERROR';
    let message = response.statusText;

    try {
      const body = await response.json();
      // Parse the standard APIResponseEnvelope error shape from the backend
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? body?.detail ?? message;
    } catch {
      // Response was not JSON — use status text
    }

    throw new ApiRequestError(response.status, code, message);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

export const apiGet = <T>(endpoint: string, init?: RequestInit) =>
  fetchApi<T>(endpoint, { ...init, method: 'GET' });

export const apiPost = <T>(endpoint: string, body: unknown, init?: RequestInit) =>
  fetchApi<T>(endpoint, {
    ...init,
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiPut = <T>(endpoint: string, body: unknown, init?: RequestInit) =>
  fetchApi<T>(endpoint, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDelete = <T>(endpoint: string, init?: RequestInit) =>
  fetchApi<T>(endpoint, { ...init, method: 'DELETE' });

// ---------------------------------------------------------------------------
// Authenticated SSE helper (used by planner.ts)
// ---------------------------------------------------------------------------

/**
 * Open an authenticated SSE connection.
 * Returns an EventSource-compatible ReadableStreamDefaultReader.
 *
 * WHY NOT native EventSource: The native EventSource API does not support
 * custom request headers, so we cannot attach the Authorization header.
 * Using fetch + ReadableStream gives us full header control.
 */
export async function fetchAuthenticatedStream(
  endpoint: string,
  body: unknown,
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getFirebaseToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': getCsrfToken(),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiRequestError(
      response.status,
      'SSE_CONNECTION_FAILED',
      `SSE stream failed [${response.status}]: ${errorText}`,
    );
  }

  if (!response.body) {
    throw new ApiRequestError(500, 'NO_STREAM_BODY', 'ReadableStream not supported or empty body.');
  }

  return response.body.getReader();
}
