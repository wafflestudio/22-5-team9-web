import React, { useState } from 'react';
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from 'react-draggable';

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  style: TextStyle;
}

interface TextStyle {
  fontSize: number;
  color: string;
  backgroundColor: string | null;
  fontFamily: string;
}

interface TextEditorProps {
  onTextAdd: (text: string, style: TextStyle, x: number, y: number) => void;
  onTextUpdate: (
    id: string,
    text: string,
    style: TextStyle,
    x: number,
    y: number,
  ) => void;
  onTextDelete: (id: string) => void;
  layers: TextLayer[];
}

export const TextEditor: React.FC<TextEditorProps> = ({
  onTextAdd,
  onTextUpdate,
  onTextDelete,
  layers,
}) => {
  const [text, setText] = useState('');
  const [editingLayer, setEditingLayer] = useState<string | null>(null);
  const [style, setStyle] = useState<TextStyle>({
    fontSize: 32,
    color: '#ffffff',
    backgroundColor: null,
    fontFamily: 'Arial',
  });

  const handleAddText = () => {
    if (text.length === 0) return;
    onTextAdd(text, style, window.innerWidth / 2, window.innerHeight / 2);
    setText('');
  };

  const handleLayerClick = (layer: TextLayer) => {
    setEditingLayer(layer.id);
    setText(layer.text);
    setStyle(layer.style);
  };

  const handleDragStop = (
    id: string,
    _e: DraggableEvent,
    data: DraggableData,
  ) => {
    const layer = layers.find((l) => l.id === id);
    if (layer != null) {
      onTextUpdate(id, layer.text, layer.style, data.x, data.y);
    }
  };

  return (
    <div className="absolute inset-0">
      {/* Text Layers */}
      {layers.map((layer) => (
        <Draggable
          key={layer.id}
          position={{ x: layer.x, y: layer.y }}
          onStop={(e, data) => {
            handleDragStop(layer.id, e, data);
          }}
        >
          <div
            className="absolute cursor-move"
            onClick={() => {
              handleLayerClick(layer);
            }}
          >
            <div
              style={{
                fontSize: `${layer.style.fontSize}px`,
                fontFamily: layer.style.fontFamily,
                color: layer.style.color,
                backgroundColor: layer.style.backgroundColor ?? undefined,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                padding: '4px',
              }}
            >
              {layer.text}
            </div>
            {editingLayer === layer.id && (
              <div className="absolute top-full left-0 flex gap-2 mt-2">
                <button
                  onClick={() => {
                    onTextDelete(layer.id);
                  }}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </Draggable>
      ))}

      {/* Text Input Controls */}
      <div className="absolute left-1/2 bottom-20 -translate-x-1/2 w-3/4 max-w-md">
        <div className="bg-black/50 p-4 rounded-lg">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="Type something..."
            className="w-full p-2 bg-transparent border border-white/30 rounded text-white text-center mb-4"
            style={{
              fontSize: `${style.fontSize}px`,
              fontFamily: style.fontFamily,
            }}
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setStyle({ ...style, fontSize: style.fontSize + 4 });
              }}
              className="p-2 bg-white/10 text-white rounded"
              type="button"
            >
              A+
            </button>
            <button
              onClick={() => {
                setStyle({
                  ...style,
                  fontSize: Math.max(12, style.fontSize - 4),
                });
              }}
              className="p-2 bg-white/10 text-white rounded"
              type="button"
            >
              A-
            </button>
            <input
              type="color"
              value={style.color}
              onChange={(e) => {
                setStyle({ ...style, color: e.target.value });
              }}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <button
              onClick={handleAddText}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              type="button"
            >
              Add Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
