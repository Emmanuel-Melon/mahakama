import { ClusterOptions } from "ioredis";

export interface IRedisClient {
  get<T = string>(key: string): Promise<T | null>;
  set(
    key: string,
    value: any,
    options?: { ex?: number; px?: number },
  ): Promise<void>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<number>;
}

export type IORedisConfig = {
  mode: "standalone" | "cluster";
  standalone?: {
    host?: string;
    port?: number;
    password?: string;
  };
  cluster?: {
    nodes: Array<{ host: string; port: number }>;
    options?: ClusterOptions;
  };
};
