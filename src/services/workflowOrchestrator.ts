import { creditService, InsufficientCreditsError } from './creditService';
import { workflowRunService } from './workflowRunService';
import { storageService } from './storageService';
import { ImageProvider } from '../interfaces/ImageProvider';
import { ProviderError, StorageError, WorkflowError } from '../lib/errors';

export const workflowOrchestrator = {
  /**
   * Executes the full image generation workflow safely.
   */
  async executeImageWorkflow(
    userId: string, 
    prompt: string, 
    provider: ImageProvider, 
    creditsCost: number = 1,
    idempotencyKey?: string
  ) {
    if (!userId || !prompt) {
      throw new WorkflowError("Invalid input: userId and prompt are required.");
    }

    // 1. Create a pending run (with Idempotency Protection)
    let run;
    try {
      run = await workflowRunService.createPendingRun(userId, prompt, creditsCost, idempotencyKey);
    } catch (error: any) {
      // Prisma P2002 Unique Constraint Failed
      if (error.code === 'P2002' && idempotencyKey) {
        const existingRun = await workflowRunService.findByIdempotencyKey(idempotencyKey);
        if (existingRun) {
          // Return the existing run without executing provider or consuming credits again
          return {
            runId: existingRun.id,
            assetUrl: existingRun.assetUrl,
            status: existingRun.status,
            duplicate: true
          };
        }
      }
      throw error;
    }

    // 2. Reserve credits
    try {
      await creditService.reserveCredits(userId, creditsCost);
    } catch (error) {
      // Mark as failed due to insufficient credits or reservation error
      await workflowRunService.markFailed(run.id, error instanceof Error ? error.message : "Credit reservation failed");
      // Re-throw so caller knows what happened. No refund needed since reservation failed.
      throw error; 
    }

    // 3. Provider Generation
    let generationResult;
    try {
      generationResult = await provider.generate({ prompt });
      if (!generationResult.success) {
        throw new ProviderError(generationResult.error || "Provider failed", generationResult.providerMetadata);
      }
    } catch (error) {
      // Provider failed (or threw an error). Mark as failed.
      const errorMsg = error instanceof Error ? error.message : "Unknown provider error";
      await workflowRunService.markFailed(run.id, errorMsg);
      
      // Refund credits exactly once since generation failed and cost was not incurred.
      try {
        await creditService.refundCredits(run.id);
      } catch (refundError) {
        // If refund fails (e.g. already refunded), log it
        console.error(`Failed to refund credits for run ${run.id}:`, refundError);
      }
      
      throw error instanceof ProviderError ? error : new ProviderError(errorMsg);
    }

    // 4. Storage
    let assetUrl;
    try {
      if (!generationResult.data) {
        throw new StorageError("No data returned from provider on success");
      }
      assetUrl = await storageService.uploadAsset(run.id, generationResult.data);
    } catch (error) {
      // Storage failed, but provider succeeded (so cost WAS incurred).
      // DO NOT refund.
      const errorMsg = error instanceof Error ? error.message : "Storage upload failed";
      await workflowRunService.markFailed(run.id, errorMsg);
      throw error instanceof StorageError ? error : new StorageError(errorMsg);
    }

    // 5. Success
    const updatedRun = await workflowRunService.markSuccess(run.id, assetUrl);
    
    return {
      runId: run.id,
      assetUrl,
      providerMetadata: generationResult.providerMetadata
    };
  }
};
