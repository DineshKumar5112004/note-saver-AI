import { supabase } from '@/lib/supabase';

export const storageService = {
  // Upload file to storage
  async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { url: publicUrl, error: null };
    } catch (error) {
      return {
        url: null,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  // Delete file from storage
  async deleteFile(
    bucket: string,
    path: string
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Delete failed' };
    }
  },

  // Validate file
  validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
  ): { valid: boolean; error: string | null } {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
      };
    }

    return { valid: true, error: null };
  },
};
