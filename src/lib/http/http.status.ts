import type { HttpStatusCatalog } from "./http.types";

export const HttpStatus: HttpStatusCatalog = {
  // 2xx Success
  SUCCESS: {
    statusCode: 200,
    title: "Request Successful",
    code: "SUCCESS",
    description: "The request has succeeded.",
  },
  CREATED: {
    statusCode: 201,
    title: "Resource Created Successfully",
    code: "CREATED",
    description:
      "The request has been fulfilled and resulted in a new resource being created.",
  },
  ACCEPTED: {
    statusCode: 202,
    title: "Request Accepted for Processing",
    code: "ACCEPTED",
    description:
      "The request has been accepted for processing, but the processing has not been completed.",
  },
  NO_CONTENT: {
    statusCode: 204,
    title: "No Content to Return",
    code: "NO_CONTENT",
    description:
      "The server successfully processed the request, but is not returning any content.",
  },

  // 3xx Redirection
  MOVED_PERMANENTLY: {
    statusCode: 301,
    title: "Resource Moved Permanently",
    code: "MOVED_PERMANENTLY",
    description:
      "The requested resource has been assigned a new permanent URI.",
  },
  FOUND: {
    statusCode: 302,
    title: "Resource Found",
    code: "FOUND",
    description:
      "The requested resource resides temporarily under a different URI.",
  },
  NOT_MODIFIED: {
    statusCode: 304,
    title: "Resource Not Modified",
    code: "NOT_MODIFIED",
    description:
      "The resource has not been modified since the version specified by the request headers.",
  },
  TEMPORARY_REDIRECT: {
    statusCode: 307,
    title: "Temporary Redirect",
    code: "TEMPORARY_REDIRECT",
    description:
      "The request should be repeated with another URI, but future requests should still use the original URI.",
  },
  PERMANENT_REDIRECT: {
    statusCode: 308,
    title: "Permanent Redirect",
    code: "PERMANENT_REDIRECT",
    description:
      "The request and all future requests should be repeated using another URI.",
  },

  // 4xx Client Errors
  BAD_REQUEST: {
    statusCode: 400,
    title: "Bad Request",
    code: "BAD_REQUEST",
    description:
      "The request could not be understood or was missing required parameters.",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    title: "Unauthorized Request",
    code: "UNAUTHORIZED",
    description:
      "Authentication failed or user doesn't have permissions for the requested operation.",
  },
  PAYMENT_REQUIRED: {
    statusCode: 402,
    title: "Payment Required",
    code: "PAYMENT_REQUIRED",
    description: "Payment is required to fulfill the request.",
  },
  FORBIDDEN: {
    statusCode: 403,
    title: "Forbidden Request",
    code: "FORBIDDEN",
    description:
      "The server understood the request but refuses to authorize it.",
  },
  NOT_FOUND: {
    statusCode: 404,
    title: "Resource Not Found",
    code: "NOT_FOUND",
    description: "The requested resource could not be found on the server.",
  },
  METHOD_NOT_ALLOWED: {
    statusCode: 405,
    title: "Method Not Allowed",
    code: "METHOD_NOT_ALLOWED",
    description: "The HTTP method is not supported for the requested resource.",
  },
  NOT_ACCEPTABLE: {
    statusCode: 406,
    title: "Not Acceptable",
    code: "NOT_ACCEPTABLE",
    description:
      "The target resource does not have a current representation that would be acceptable to the user agent.",
  },
  REQUEST_TIMEOUT: {
    statusCode: 408,
    title: "Request Timeout",
    code: "REQUEST_TIMEOUT",
    description: "The server timed out waiting for the request.",
  },
  CONFLICT: {
    statusCode: 409,
    title: "Conflict Occurred",
    code: "CONFLICT",
    description:
      "The request could not be completed due to a conflict with the current state of the target resource.",
  },
  GONE: {
    statusCode: 410,
    title: "Resource Gone",
    code: "GONE",
    description:
      "The requested resource is no longer available and will not be available again.",
  },
  TOO_MANY_REQUESTS: {
    statusCode: 429,
    title: "Too Many Requests",
    code: "TOO_MANY_REQUESTS",
    description:
      "The user has sent too many requests in a given amount of time.",
  },

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    title: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    description:
      "An unexpected condition was encountered and no more specific message is suitable.",
  },
  NOT_IMPLEMENTED: {
    statusCode: 501,
    title: "Not Implemented",
    code: "NOT_IMPLEMENTED",
    description:
      "The server does not support the functionality required to fulfill the request.",
  },
  BAD_GATEWAY: {
    statusCode: 502,
    title: "Bad Gateway",
    code: "BAD_GATEWAY",
    description:
      "The server, while acting as a gateway or proxy, received an invalid response from an inbound server.",
  },
  SERVICE_UNAVAILABLE: {
    statusCode: 503,
    title: "Service Unavailable",
    code: "SERVICE_UNAVAILABLE",
    description:
      "The server is currently unable to handle the request due to temporary overloading or maintenance.",
  },
  GATEWAY_TIMEOUT: {
    statusCode: 504,
    title: "Gateway Timeout",
    code: "GATEWAY_TIMEOUT",
    description:
      "The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.",
  },
} as const;
