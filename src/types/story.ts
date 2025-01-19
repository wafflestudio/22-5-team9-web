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

