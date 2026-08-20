import CircuitBreaker from "opossum";

import type { BreakerStats, RegisteredBreaker } from "./circuit-breaker.types";

const registry = new Map<string, RegisteredBreaker>();

export const registerBreaker = (
  name: string,
  breaker: CircuitBreaker<any, any>,
) => {
  registry.set(name, { name, breaker });
};

const mapBreakerToStats = (
  name: string,
  breaker: CircuitBreaker<any, any>,
): BreakerStats => ({
  name,
  state: breaker.opened ? "OPEN" : breaker.halfOpen ? "HALF_OPEN" : "CLOSED",
  fires: breaker.stats.fires,
  failures: breaker.stats.failures,
  successes: breaker.stats.successes,
  timeouts: breaker.stats.timeouts,
  rejects: breaker.stats.rejects,
  fallbacks: breaker.stats.fallbacks,
});

export const getAllBreakerStats = (): BreakerStats[] => {
  return [...registry.values()].map(({ name, breaker }) =>
    mapBreakerToStats(name, breaker),
  );
};

export const getBreakerStats = (name: string): BreakerStats | undefined => {
  const entry = registry.get(name);
  if (!entry) return undefined;
  return mapBreakerToStats(entry.name, entry.breaker);
};

export const isSystemHealthy = () =>
  getAllBreakerStats().every((breaker) => breaker.state !== "OPEN");
