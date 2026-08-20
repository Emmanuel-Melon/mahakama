import CircuitBreaker from "opossum";

export interface BreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  rollingCountTimeout?: number;
  rollingCountBuckets?: number;
  volumeThreshold?: number;
  errorFilter?: (err: unknown) => boolean;
  service?: "brevo" | "stripe" | "storage";
}

export interface RegisteredBreaker {
  name: string;
  breaker: CircuitBreaker;
}

export interface BreakerStats {
  name: string;
  state: "OPEN" | "HALF_OPEN" | "CLOSED";
  fires: number;
  failures: number;
  successes: number;
  timeouts: number;
  rejects: number;
  fallbacks: number;
}

export interface EventHandlerContext {
  name: string;
  service?: BreakerOptions["service"];
  config: {
    timeout: number;
    resetTimeout: number;
  };
}
