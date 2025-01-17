const PostGrid = () => {
  const posts = Array(4).fill(null);

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((_, index) => (
        <div key={index} className="aspect-square bg-gray-200"></div>
      ))}
    </div>
  );
};

export default PostGrid;
