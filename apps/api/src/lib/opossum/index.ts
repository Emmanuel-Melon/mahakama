import CircuitBreaker from "opossum";

import { attachBreakerEvents } from "./circuit-breaker.events";
import { registerBreaker } from "./circuit-breaker.registry";
import type { BreakerOptions } from "./circuit-breaker.types";

const DEFAULTS: Required<Omit<BreakerOptions, "service" | "errorFilter">> & {
  errorFilter: () => boolean;
} = {
  timeout: 10000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  rollingCountTimeout: 10000,
  rollingCountBuckets: 10,
  volumeThreshold: 5,
  errorFilter: () => true,
};

export const createBreaker = <Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
  name: string,
  options: BreakerOptions = {},
) => {
  const { service, ...circuitOptions } = options;
  const config = { ...DEFAULTS, ...circuitOptions };
  const breaker = new CircuitBreaker(action, { ...config, name });

  registerBreaker(name, breaker);

  attachBreakerEvents(breaker, {
    name,
    service,
    config: {
      timeout: config.timeout,
      resetTimeout: config.resetTimeout,
    },
  });

  return breaker;
};
