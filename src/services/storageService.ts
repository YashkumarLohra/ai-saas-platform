import { createClient } from '@supabase/supabase-js';
import { StorageError } from '../lib/errors';

// Initialize a separate service role client for backend admin tasks like storage upload.
// In tests, these variables can be mocked or the module can be mocked.
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!url || !serviceRoleKey) {
    console.warn("StorageService: Missing Supabase credentials. Ensure SUPABASE_SERVICE_ROLE_KEY is set.");
  }
  
  return createClient(url || 'http://localhost', serviceRoleKey || 'dummy_key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export const storageService = {
  /**
   * Uploads an image buffer to the private 'workflow-assets' bucket.
   * Uses service-role credentials to bypass RLS, ensuring strict server-side only access.
   * @returns A string reference/path to the asset.
   */
  async uploadAsset(workflowRunId: string, imageBuffer: Buffer | ArrayBuffer, contentType: string = 'image/png'): Promise<string> {
    try {
      const supabase = getServiceClient();
      
      const fileName = `${workflowRunId}_${Date.now()}.png`;
      const bucketName = 'workflow-assets'; // Must be a private bucket in Supabase

      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, imageBuffer, {
          contentType: contentType,
          upsert: false
        });

      if (error) {
        throw new StorageError(`Failed to upload asset: ${error.message}`);
      }

      // We return the relative path (not a public URL) because the bucket is private.
      // Access to the image will be brokered via signed URLs or an authenticated API route later.
      return data.path;
    } catch (err) {
      if (err instanceof StorageError) throw err;
      throw new StorageError(`Unexpected error during upload: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
};
