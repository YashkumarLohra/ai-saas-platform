import { ApiError, AuthenticationError, NetworkError } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig extends Omit<RequestInit, "method"> {
  /** Optional timeout in milliseconds. Defaults to 10000ms (10 seconds). */
  timeoutMs?: number;
  /** Optional number of retry attempts for 5xx transient errors. Defaults to 0. */
  retries?: number;
}

const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_RETRIES = 0;

/**
 * Gets the base URL for the API from environment variables.
 * Falls back to localhost in development if not provided.
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
}

/**
 * Normalizes HTTP status codes into standardized ApiError subclasses.
 */
async function handleResponse(response: Response): Promise<any> {
  if (response.ok) {
    // Attempt to parse JSON. If the response is empty (e.g. 204 No Content), return null.
    if (response.status === 204) return null;
    
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = await response.text();
  }

  const message = errorData?.message || errorData?.error || `Request failed with status ${response.status}`;

  if (response.status === 401 || response.status === 403) {
    throw new AuthenticationError(message);
  }

  throw new ApiError(response.status, message, errorData);
}

/**
 * Core request wrapper that handles timeouts, cancellation, headers, and error normalization.
 */
async function makeRequest(
  method: HttpMethod,
  endpoint: string,
  config: RequestConfig = {}
): Promise<any> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES, headers, ...customConfig } = config;

  const url = `${getBaseUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Merge default JSON headers with custom headers
  const mergedHeaders = new Headers(headers);
  if (!mergedHeaders.has("Content-Type") && method !== "GET" && method !== "DELETE") {
    mergedHeaders.set("Content-Type", "application/json");
  }

  // Handle AbortSignal and timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // If a custom signal was provided, link it
  if (customConfig.signal) {
    customConfig.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }

  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        signal: controller.signal,
        ...customConfig,
      });

      clearTimeout(timeoutId);
      return await handleResponse(response);
    } catch (error) {
      // If we aborted because of a timeout or manual cancellation, throw immediately.
      if (error instanceof DOMException && error.name === "AbortError") {
        clearTimeout(timeoutId);
        throw new NetworkError(
          customConfig.signal?.aborted ? "Request cancelled." : "Request timed out."
        );
      }

      // We only retry network failures or 5xx server errors (not caught in handleResponse, wait,
      // fetch only throws TypeError for network errors. 5xx returns normally and gets caught by handleResponse).
      // So if it's a TypeError, it's a NetworkError.
      if (error instanceof TypeError) {
        if (attempt < retries) {
          attempt++;
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
          continue;
        }
        clearTimeout(timeoutId);
        throw new NetworkError();
      }
      
      // If it's an ApiError (from handleResponse), we check if we should retry
      if (error instanceof ApiError) {
        if (error.status >= 500 && error.status < 600 && attempt < retries) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
          continue;
        }
      }

      clearTimeout(timeoutId);
      throw error; // Rethrow AuthenticationError, 400 errors, or exhausted retries
    }
  }
}

/**
 * Centralized API Client
 * 
 * Provides HTTP methods pre-configured with the application's base URL,
 * error normalization, timeout handling, and basic retry logic.
 */
export const apiClient = {
  get: (endpoint: string, config?: RequestConfig) => makeRequest("GET", endpoint, config),
  
  post: (endpoint: string, body: any, config?: RequestConfig) => 
    makeRequest("POST", endpoint, { 
      ...config, 
      body: JSON.stringify(body) 
    }),
    
  put: (endpoint: string, body: any, config?: RequestConfig) => 
    makeRequest("PUT", endpoint, { 
      ...config, 
      body: JSON.stringify(body) 
    }),
    
  patch: (endpoint: string, body: any, config?: RequestConfig) => 
    makeRequest("PATCH", endpoint, { 
      ...config, 
      body: JSON.stringify(body) 
    }),
    
  delete: (endpoint: string, config?: RequestConfig) => makeRequest("DELETE", endpoint, config),
};
