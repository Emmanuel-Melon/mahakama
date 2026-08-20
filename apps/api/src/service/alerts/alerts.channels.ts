import { logger } from "@/lib/logger";

import type { AlertChannel } from "./alerts.types";

// Channel registry — populated at app init to avoid circular deps
const channels = new Map<string, AlertChannel>();

export const registerAlertChannel = (name: string, channel: AlertChannel) => {
  channels.set(name, channel);
  logger.info({ channel: name }, "Alert channel registered");
};

export const getAlertChannel = (name: string): AlertChannel | undefined => {
  return channels.get(name);
};

export const hasAlertChannel = (name: string): boolean => {
  return channels.has(name);
};
