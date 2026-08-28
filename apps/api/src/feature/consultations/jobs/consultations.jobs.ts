import { logger } from "@/lib/logger";
import type {
  ConsultationRequestedPayload,
  ConsultationAcceptedPayload,
  ConsultationDeclinedPayload,
  ConsultationEngagedPayload,
} from "../consultations.types";

export class ConsultationsJobHandler {
  static async handleConsultationRequested(data: ConsultationRequestedPayload) {
    const { consultationId, customerId, lawyerId } = data;

    logger.info(
      { consultationId, customerId, lawyerId },
      "Processing consultation requested job",
    );

    // TODO: Add consultation requested logic here
    // - Notify lawyer of new request
    // - Send confirmation to customer

    return { success: true, consultationId };
  }

  static async handleConsultationAccepted(data: ConsultationAcceptedPayload) {
    const { consultationId, customerId, lawyerId } = data;

    logger.info(
      { consultationId, customerId, lawyerId },
      "Processing consultation accepted job",
    );

    // TODO: Add consultation accepted logic here
    // - Notify customer their request was accepted
    // - Open/initialize chat thread

    return { success: true, consultationId };
  }

  static async handleConsultationDeclined(data: ConsultationDeclinedPayload) {
    const { consultationId, customerId, lawyerId, declineReason } = data;

    logger.info(
      { consultationId, customerId, lawyerId, declineReason },
      "Processing consultation declined job",
    );

    // TODO: Add consultation declined logic here
    // - Notify customer of decline, with reason
    // - Suggest alternative lawyers

    return { success: true, consultationId };
  }

  static async handleConsultationEngaged(data: ConsultationEngagedPayload) {
    const { consultationId, customerId, lawyerId } = data;

    logger.info(
      { consultationId, customerId, lawyerId },
      "Processing consultation engaged job",
    );

    // TODO: Add consultation engaged logic here
    // - Notify both parties representation has begun
    // - Trigger any downstream case-tracking setup

    return { success: true, consultationId };
  }
}
