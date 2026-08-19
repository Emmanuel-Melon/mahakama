import type { JsonApiError } from "./api.types.js";

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly errors: JsonApiError[];

  constructor(status: number, errors: JsonApiError[]) {
    super(errors[0]?.detail || "An unexpected API error occurred");

    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;

    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Request timed out after ${ms}ms`);
    this.name = "TimeoutError";
  }
}
