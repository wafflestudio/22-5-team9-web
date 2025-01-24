import React, { useState } from 'react';

interface TextStyle {
  fontSize: number;
  color: string;
  backgroundColor: string | null;
  fontFamily: string;
}

interface TextEditorProps {
  onTextAdd: (text: string, style: TextStyle) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onTextAdd }) => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState<TextStyle>({
    fontSize: 24,
    color: '#ffffff',
    backgroundColor: null,
    fontFamily: 'sans-serif'
  });

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-md">
      <input
        type="text"
        value={text}
        onChange={(e) => { setText(e.target.value); }}
        placeholder="Type something..."
        className="w-full p-4 bg-transparent border-none outline-none text-white text-center text-2xl"
        style={{
          fontSize: `${style.fontSize}px`,
          fontFamily: style.fontFamily,
          color: style.color,
          backgroundColor: style.backgroundColor ?? undefined
        }}
      />
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => { setStyle({ ...style, fontSize: style.fontSize + 2 }); }}
          className="p-2 bg-black/50 text-white rounded"
          type="button"
        >
          A+
        </button>
        <button
          onClick={() => { setStyle({ ...style, fontSize: style.fontSize - 2 }); }}
          className="p-2 bg-black/50 text-white rounded"
          type="button"
        >
          A-
        </button>
        <input
          type="color"
          value={style.color}
          onChange={(e) => { setStyle({ ...style, color: e.target.value }); }}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <button
          onClick={() => {
            if (text.length > 0) {
              onTextAdd(text, style);
              setText('');
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          type="button"
        >
          Add
        </button>
      </div>
    </div>
  );
};