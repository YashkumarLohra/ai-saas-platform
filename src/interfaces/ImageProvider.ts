export interface ImageGenerationRequest {
  prompt: string;
  // Extensible options without freezing the API
  options?: {
    model?: string;
    aspectRatio?: string;
    [key: string]: any;
  };
}

export interface ImageGenerationResult {
  success: boolean;
  // If successful, returns the raw image data (e.g. ArrayBuffer or Buffer)
  data?: Buffer | ArrayBuffer;
  // If failed, returns a specific error message
  error?: string;
  // Any provider-specific metadata (e.g. model used, generation time)
  providerMetadata?: any;
}

/**
 * Interface that all Image Generation Providers must implement.
 * Ensures the workflow orchestration remains provider-independent.
 */
export interface ImageProvider {
  /**
   * Generates an image based on the provided request.
   */
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResult>;
}
