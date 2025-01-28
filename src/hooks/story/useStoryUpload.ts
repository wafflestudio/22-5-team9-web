import { useState } from 'react';

import type { Story } from '../../types/story';

export function useStoryUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadStory = async (files: FileList): Promise<Story> => {
    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(
        'https://waffle-instaclone.kro.kr/api/story/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error('Failed to upload story');
      return await (response.json() as Promise<Story>);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadStory };
}
