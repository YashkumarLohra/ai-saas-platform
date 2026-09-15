import { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from '../interfaces/ImageProvider';

/**
 * A mock image provider for testing and safe staging execution.
 * Costs 0 credits and has zero external network calls.
 */
export class MockImageProvider implements ImageProvider {
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    // Explicitly simulate failure if the prompt matches a specific test string
    if (request.prompt === 'FAIL_TEST') {
      return {
        success: false,
        error: 'Simulated provider failure',
        providerMetadata: { mock: true }
      };
    }

    // For testing purposes, we simply return a dummy 1-byte buffer
    const dummyBuffer = Buffer.from([0x00]);

    return {
      success: true,
      data: dummyBuffer,
      providerMetadata: { 
        mock: true, 
        model: request.options?.model || 'mock-model-v1',
        prompt: request.prompt 
      }
    };
  }
}
