export interface Medium {
  image_id: number;
  post_id?: number;
  story_id?: number;
  file_name: string;
  url: string;
}

export interface MediumUploadRequest {
  file: File;
  post_id?: number;
  story_id?: number;
}
