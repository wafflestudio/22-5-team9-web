import React from 'react';

type HighlightItemProps = {
  name: string;
};

const HighlightItem = ({ name }: HighlightItemProps) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-full bg-gray-200 mb-1"></div>
    <span className="text-xs">{name}</span>
  </div>
);

const Highlights: React.FC = () => {
  const highlights = ['test1', 'test2', 'test3'];

  return (
    <div className="flex space-x-4 mb-8 overflow-x-auto">
      {highlights.map((highlight, index) => (
        <HighlightItem key={index} name={highlight} />
      ))}
    </div>
  );
};

export default Highlights;
