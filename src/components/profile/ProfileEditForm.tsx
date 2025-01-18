import React, { useContext,useState } from 'react';

import { LoginContext } from '../../App';

const ProfileEditForm = () => {
  const context = useContext(LoginContext);
  const [name, setName] = useState(context.myProfile?.username || '');
  const [bio, setBio] = useState(context.myProfile?.bio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update the profile goes here
    console.log('Profile updated:', { name, bio });
  };

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEditForm;