export interface Story {
  story_id: number;
  creation_date: string;
  expiration_date: string;
  user_id: number;
  file_url: string[];
}

export interface StoryViewer {
  user_id: number;
  username: string;
}

/* export interface StoryUser {
  user_id: number;
  username: string;
  profile_image: string;
  stories: Story[];
}

export interface StoryUploadResponse {
  story_id: number;
  file_url: string[];
}

export interface StoryError {
  detail: string;
}

*/
