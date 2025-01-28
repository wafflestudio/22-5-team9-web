import { Music, Palette, PenTool, Sticker, Type } from 'lucide-react';
import { useState } from 'react';

interface ControlsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  const handleFeatureClick = (id: string) => {
    if (id === 'stickers' || id === 'music') {
      setTooltipMessage(
        `${id === 'stickers' ? 'Stickers' : 'Music'} feature coming soon!`,
      );
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return;
    }
    onTabChange(id);
  };
  const controls = [
    { id: 'draw', Icon: PenTool },
    { id: 'text', Icon: Type },
    { id: 'stickers', Icon: Sticker },
    { id: 'music', Icon: Music },
    { id: 'filters', Icon: Palette },
  ];

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
      {controls.map(({ id, Icon }) => (
        <button
          key={id}
          onClick={() => {
            handleFeatureClick(id);
          }}
          className={`p-2 rounded-full ${
            activeTab === id ? 'bg-blue-500' : 'bg-black/50'
          }`}
        >
          <Icon className="w-6 h-6 text-white" />
        </button>
      ))}
      {showTooltip && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/75 text-white px-4 py-2 rounded whitespace-nowrap">
          {tooltipMessage}
        </div>
      )}
    </div>
  );
};
