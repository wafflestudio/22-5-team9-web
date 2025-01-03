import { Heart, MessageCircle, Send } from 'lucide-react';

type PostProps = {
  username: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
};

const Post = ({
  username,
  imageUrl,
  caption,
  likes,
  comments,
  timestamp,
}: PostProps) => (
  <div className="bg-white border rounded-md">
    <div className="flex items-center p-4">
      <img
        src="/placeholder.svg"
        alt={username}
        className="w-8 h-8 rounded-full"
      />
      <span className="ml-3 font-semibold">{username}</span>
    </div>
    <img src={imageUrl} alt="Post" className="w-full" />
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <Heart className="w-6 h-6" />
        <MessageCircle className="w-6 h-6" />
        <Send className="w-6 h-6" />
      </div>
      <p className="font-semibold mb-2">{likes.toLocaleString()} likes</p>
      <p>
        <span className="font-semibold">{username}</span> {caption}
      </p>
      <p className="text-gray-500 text-sm mt-2">View all {comments} comments</p>
      <p className="text-gray-400 text-xs mt-1">{timestamp}</p>
    </div>
  </div>
);

export default Post;
