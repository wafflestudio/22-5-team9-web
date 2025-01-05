const Story = () => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
      <div className="w-full h-full rounded-full bg-white p-0.5">
        <img src="" alt="Story" className="w-full h-full rounded-full" />
      </div>
    </div>
    <p className="mt-1 text-xs">username</p>
  </div>
);

const Stories = () => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Story key={i} />
      ))}
    </div>
  );
};

export default Stories;
