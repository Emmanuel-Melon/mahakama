import { logger } from "@/lib/logger";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { findLawyerById } from "../operations/lawyers.find";
import { LawyerJobs } from "../lawyers.config";
import { LawyersJobMap } from "../lawyers.types";

export class LawyersJobHandler {
  static async handleLawyerOnboarded(
    data: LawyersJobMap[typeof LawyerJobs.LawyerOnboarded],
  ) {
    const { lawyerId, userId } = data;

    // Find the lawyer record
    const lawyer = unwrapJobResult(await findLawyerById(lawyerId), {
      message: "Could not find lawyer",
      shouldRetry: false,
    });

    logger.info(
      { lawyerId, userId, lawyerName: lawyer.data?.name },
      "Processing lawyer onboarded job",
    );

    // TODO: Add onboarding logic here
    // - Send welcome email
    // - Setup initial profile
    // - Notify admin team
    // - Schedule verification process

    return { success: true, lawyerId, userId };
  }

  static async handleLawyerVerified(
    data: LawyersJobMap[typeof LawyerJobs.LawyerVerified],
  ) {
    const { lawyerId, userId, verifiedBy } = data;

    // Find the lawyer record
    const lawyer = unwrapJobResult(await findLawyerById(lawyerId), {
      message: "Could not find lawyer",
      shouldRetry: false,
    });

    logger.info(
      { lawyerId, userId, verifiedBy, lawyerName: lawyer.data?.name },
      "Processing lawyer verified job",
    );

    // TODO: Add verification logic here
    // - Send verification confirmation email
    // - Update lawyer status to active
    // - Notify client system
    // - Enable lawyer profile for public view

    return { success: true, lawyerId, userId, verifiedBy };
  }
}
