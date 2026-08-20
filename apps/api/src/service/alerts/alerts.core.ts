import { z } from "zod";

import { logger } from "@/lib/logger";

import { getAlertChannel } from "./alerts.channels";
import type {
  AlertContent,
  AlertSeverity,
  AlertTemplateDescriptor,
} from "./alerts.types";

export const sendSystemAlert = async (
  severity: AlertSeverity,
  to: string,
  content: AlertContent,
): Promise<{ sent: boolean; channel: string }> => {
  const brevoChannel = getAlertChannel("brevo");

  if (severity !== "info" && brevoChannel) {
    try {
      await brevoChannel(to, content.subject, content.bodyHtml);
      logger.info(
        { to, subject: content.subject, severity },
        "Alert email sent",
      );
      return { sent: true, channel: "brevo" };
    } catch (error) {
      logger.error(
        { error, to, subject: content.subject },
        "Alert email failed — falling back to log",
      );
    }
  }

  logger.fatal(
    {
      alertSeverity: severity,
      alertSubject: content.subject,
      alertTo: to,
      ...content.metadata,
    },
    `ALERT: ${content.subject}`,
  );

  return { sent: true, channel: "log" };
};

/**
 * Factory for typed alert generators.
 * Identical signature to createNotificationGenerators.
 */
export function createAlertGenerators<
  TAlertMap extends Record<string, AlertTemplateDescriptor>,
>(_alertMap: TAlertMap) {
  return <
    TGeneratorMap extends {
      [K in keyof TAlertMap]: (
        data: z.infer<TAlertMap[K]["schema"]>,
      ) => AlertContent | Promise<AlertContent>;
    },
  >(
    alertGenerators: TGeneratorMap,
  ): TGeneratorMap => alertGenerators;
}
