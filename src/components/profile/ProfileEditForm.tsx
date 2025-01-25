import React, { useContext, useEffect, useRef, useState } from 'react';

import { updateProfile } from '../../api/profile';
import { LoginContext } from '../../App';

const ProfileEditForm = () => {
  const context = useContext(LoginContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(context?.myProfile?.username);
  const [bio, setBio] = useState(context?.myProfile?.introduce);
  const [imagePreview] = useState(context?.myProfile?.profile_image);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localImageUrl != null) {
        URL.revokeObjectURL(localImageUrl);
      }
    };
  }, [localImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file != null) {
      setImageFile(file);
      if (localImageUrl != null) {
        URL.revokeObjectURL(localImageUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setLocalImageUrl(newUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedProfile = await updateProfile({
        username: name,
        introduce: bio,
        profile_image: imageFile,
      });

      context?.handleIsLoggedIn(true, updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-center">Edit Profile</h1>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="flex-1 flex flex-col"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                localImageUrl ??
                (imagePreview != null
                  ? `https://waffle-instaclone.kro.kr/${imagePreview}`
                  : '/default-profile.png')
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="block w-full border border-gray-300 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
              className="block w-full border border-gray-300 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-center mt-auto pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
