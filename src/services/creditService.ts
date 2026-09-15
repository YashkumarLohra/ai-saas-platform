import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export class InsufficientCreditsError extends Error {
  constructor(message = "Insufficient credits") {
    super(message);
    this.name = "InsufficientCreditsError";
  }
}

export const creditService = {
  /**
   * Atomically reserves credits from a user's balance.
   * Throws an error if the user doesn't have enough credits.
   */
  async reserveCredits(userId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Reservation amount must be positive");
    }

    try {
      // Use atomic decrement with WHERE clause to prevent negative balances
      await prisma.user.update({
        where: {
          id: userId,
          credits: {
            gte: amount, // Must have at least 'amount' credits
          },
        },
        data: {
          credits: {
            decrement: amount,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025' // Record to update not found (meaning where clause failed)
      ) {
        throw new InsufficientCreditsError();
      }
      throw error;
    }
  },

  /**
   * Atomically refunds credits back to a user's balance based on a specific WorkflowRun.
   * Prevents double-refunding the same WorkflowRun.
   */
  async refundCredits(runId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. Find the workflow run
      const run = await tx.workflowRun.findUnique({
        where: { id: runId },
      });

      if (!run) {
        throw new Error("WorkflowRun not found");
      }

      // 2. Double-refund protection
      if (run.isRefunded) {
        throw new Error("WorkflowRun has already been refunded");
      }

      // 3. Mark the run as refunded atomically
      const updateResult = await tx.workflowRun.updateMany({
        where: {
          id: runId,
          isRefunded: false,
        },
        data: {
          isRefunded: true,
        },
      });

      if (updateResult.count === 0) {
        throw new Error("WorkflowRun has already been refunded");
      }

      // 4. Return the credits to the user
      await tx.user.update({
        where: { id: run.userId },
        data: {
          credits: {
            increment: run.creditsUsed,
          },
        },
      });
    });
  }
};
