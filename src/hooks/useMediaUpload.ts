import { useState } from 'react';

interface UseMediaUploadResult {
  isUploading: boolean;
  progress: number;
  error: string | null;
  upload: (file: File) => Promise<string>;
  reset: () => void;
}

interface UploadResponse {
  url: string;
}

export function useMediaUpload(): UseMediaUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  };

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'https://waffle-instaclone.kro.kr/api/medium/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = (await response.json()) as UploadResponse;
      return data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, progress, error, upload, reset };
}
