import { Camera } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfilePictureUploadProps {
  currentImage: string;
  onSuccess: (newImageUrl: string) => void;
}

const ProfilePictureUpload = ({
  currentImage,
  onSuccess,
}: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file == null) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem('access_token');
      if (token == null) {
        void navigate('/');
        return;
      }

      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await fetch(
        'http://3.34.185.81:8000/api/user/profile/edit',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error('Failed to update profile picture');

      const data = (await response.json()) as { profile_image: string };
      onSuccess(data.profile_image);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <img
        src={currentImage.length > 0 ? currentImage : '/placeholder.svg'}
        alt="Profile"
        className="w-full h-full object-cover rounded-full"
      />
      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full cursor-pointer transition-all">
        <div className="text-white opacity-0 group-hover:opacity-100 flex flex-col items-center">
          <Camera className="w-6 h-6 mb-1" />
          <span className="text-xs">Change Photo</span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            void handleImageUpload(e);
          }}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
