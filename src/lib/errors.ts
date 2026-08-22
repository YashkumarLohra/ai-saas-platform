/**
 * Base error class for all application-specific errors.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Represents an HTTP error returned by the API.
 */
export class ApiError extends AppError {
  public status: number;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Represents a failure to communicate with the network (e.g. offline, DNS failure, CORS).
 */
export class NetworkError extends AppError {
  constructor(message: string = "Network error. Please check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Represents a 401 or 403 authorization/authentication failure.
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = "You are not authorized to perform this action.") {
    super(401, message);
    this.name = "AuthenticationError";
  }
}
