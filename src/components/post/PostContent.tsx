interface PostContentProps {
  userId: number;
  postText: string;
}

const PostContent = ({ userId, postText }: PostContentProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex space-x-2">
        <img
          src={''}
          alt={userId.toString()}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <span className="font-semibold mr-2">{userId}</span>
          <span>{postText}</span>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
