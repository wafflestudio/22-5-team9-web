import type { Story } from '../../../types/story';

export interface StoryMediaFile {
  file: File;
  type: 'image' | 'video';
  preview: string;
}

export interface StoryEditorProps {
  onClose: () => void;
  onSubmit: (media: File) => Promise<void>;
}

export interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  isOwner: boolean;
  onClose: () => void;
  onDelete?: (storyId: number) => Promise<void>;
}

export interface StoryItemProps {
  username: string;
  profileImage?: string;
  stories: Story[];
  onView: () => void;
}

export interface TextStyle {
	fontSize: number;
	fontFamily: string;
	color: string;
	backgroundColor?: string;
}