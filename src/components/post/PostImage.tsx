interface PostImageProps {
  imageUrl: string;
}

const PostImage = ({ imageUrl }: PostImageProps) => {
  return (
    <div className="md:w-[60%] bg-black flex items-center justify-center h-full">
      <img
        src={`https://waffle-instaclone.kro.kr/${imageUrl}`}
        alt="Post"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default PostImage;
