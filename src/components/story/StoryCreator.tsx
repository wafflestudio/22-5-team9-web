import { Music, Sticker, Type, X } from 'lucide-react';
import React, { useRef,useState } from 'react';

const StoryCreator = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<null | 'text' | 'stickers' | 'music'>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file != null) {
      // Check image ratio (Instagram typically uses 9:16 for stories)
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.height / img.width;
        if (ratio < 1.6 || ratio > 1.91) { // allowing some flexibility around 9:16
          alert("Please use an image with aspect ratio close to 9:16");
          return;
        }
        setSelectedImage(URL.createObjectURL(file));
        setIsEditing(true);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage == null) return;

    const formData = new FormData();
    // Add the edited image, stickers, text overlays etc.
    // TODO: Implement actual upload logic
    
    void (async () => {
      try {
        const response = await fetch('https://waffle-instaclone.kro.kr/api/story/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload story');
        setIsEditing(false);
        setSelectedImage(null);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    })();
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          Create Story
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex">
      {/* Main editing area */}
      <div className="flex-1 relative">
        <img
          src={selectedImage ?? ''}
          alt="Story preview"
          className="w-full h-full object-contain"
        />
        
        {/* Close button */}
        <button 
          onClick={() => { setIsEditing(false); }}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Editing toolbar */}
      <div className="w-64 bg-gray-900 p-4">
        <div className="flex justify-around mb-4">
          <button
            onClick={() => { setActiveTab('text'); }}
            className={`p-2 rounded ${activeTab === 'text' ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <Type className="text-white" />
          </button>
          <button
            onClick={() => { setActiveTab('stickers'); }}
            className={`p-2 rounded ${activeTab === 'stickers' ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <Sticker className="text-white" />
          </button>
          <button
            onClick={() => { setActiveTab('music'); }}
            className={`p-2 rounded ${activeTab === 'music' ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <Music className="text-white" />
          </button>
        </div>

        {/* Tool panels */}
        <div className="text-white">
          {activeTab === 'text' && (
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Add text..."
                className="w-full p-2 bg-gray-700 rounded"
              />
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-700 rounded">Font</button>
                <button className="p-2 bg-gray-700 rounded">Color</button>
              </div>
            </div>
          )}
          {activeTab === 'stickers' && (
            <div className="grid grid-cols-3 gap-2">
              {/* Sticker placeholders */}
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-700 rounded" />
              ))}
            </div>
          )}
          {activeTab === 'music' && (
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Search music..."
                className="w-full p-2 bg-gray-700 rounded"
              />
              <div className="space-y-2">
                {/* Music track placeholders */}
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-2 bg-gray-700 rounded">
                    Track {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={(e) => { handleUpload(e); }}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded"
        >
          Share Story
        </button>
      </div>
    </div>
  );
};

export default StoryCreator;