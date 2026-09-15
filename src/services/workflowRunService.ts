import prisma from '../lib/prisma';
import { WorkflowRunStatus } from '@prisma/client';

export const workflowRunService = {
  /**
   * Creates a PENDING WorkflowRun to track the generation attempt.
   */
  async createPendingRun(userId: string, prompt: string, creditsUsed: number, idempotencyKey?: string) {
    return prisma.workflowRun.create({
      data: {
        userId,
        prompt,
        creditsUsed,
        idempotencyKey,
        status: WorkflowRunStatus.PENDING,
      },
    });
  },

  /**
   * Finds an existing WorkflowRun by its idempotencyKey.
   */
  async findByIdempotencyKey(idempotencyKey: string) {
    return prisma.workflowRun.findUnique({
      where: { idempotencyKey },
    });
  },

  /**
   * Updates a WorkflowRun to SUCCESS and associates the generated asset URL.
   */
  async markSuccess(runId: string, assetUrl: string) {
    return prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: WorkflowRunStatus.SUCCESS,
        assetUrl,
      },
    });
  },

  /**
   * Updates a WorkflowRun to FAILED and records the error details.
   */
  async markFailed(runId: string, errorDetails: string) {
    return prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: WorkflowRunStatus.FAILED,
        errorDetails,
      },
    });
  }
};
