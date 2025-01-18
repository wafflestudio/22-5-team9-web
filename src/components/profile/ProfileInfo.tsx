import { Settings } from 'lucide-react';
import { useContext, useState } from 'react';

import { followUser, unfollowUser } from '../../api/follow';
import { myProfile } from '../../api/myProfile';
import { LoginContext } from '../../App';

type ProfileInfoProps = {
  userId: number;
  username: string;
  profileImage: string;
  posts: number;
  followers: number;
  following: number;
  fullName: string;
  bio: string;
};

const ProfileInfo = ({
  userId,
  username,
  profileImage,
  posts,
  followers,
  following,
  fullName,
  bio,
}: ProfileInfoProps) => {
  const [showUnfollowMenu, setShowUnfollowMenu] = useState(false);
  const context = useContext(LoginContext);

  const handleFollow = async () => {
    const token = localStorage.getItem('access_token') as string;
    if (token === '') {
      console.error('No token found');
      return;
    }

    const success = await followUser(token, userId);

    if (success) {
      const updatedProfile = await myProfile(token);
      if (updatedProfile != null) {
        context?.setMyProfile(updatedProfile);
      }
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('access_token') as string;
    if (token === '') {
      console.error('No token found');
      return;
    }

    const success = await unfollowUser(token, userId);
    if (success) {
      const updatedProfile = await myProfile(token);
      if (updatedProfile != null) {
        context?.setMyProfile(updatedProfile);
      }
    }
    setShowUnfollowMenu(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <img
          src={`http://3.34.185.81:8000/${profileImage}`}
          alt={username}
          className="w-20 h-20 rounded-full mr-4"
        />
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h1 className="text-xl font-semibold mr-4">{username}</h1>
            {username === context?.myProfile?.username ? (
              <button className="border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold mr-2">
                Edit Profile
              </button>
            ) : (
              <>
                {(context?.myProfile?.following.includes(userId) ?? false) ? (
                  <div className="relative">
                    <button
                      className="bg-gray-200 text-black px-4 py-1 rounded-md text-sm font-semibold mr-2"
                      onClick={() => {
                        setShowUnfollowMenu(!showUnfollowMenu);
                      }}
                    >
                      Following
                    </button>
                    {showUnfollowMenu && (
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                            onClick={() => void handleUnfollow()}
                          >
                            Unfollow @{username}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-semibold mr-2"
                    onClick={() => void handleFollow()}
                  >
                    {(context?.myProfile?.followers.includes(userId) ?? false)
                      ? 'Follow Back'
                      : 'Follow'}
                  </button>
                )}
              </>
            )}
            <Settings className="w-6 h-6" />
          </div>
          <div className="flex space-x-4 text-sm">
            <span>
              <strong>{posts}</strong> posts
            </span>
            <span>
              <strong>{followers}</strong> followers
            </span>
            <span>
              <strong>{following}</strong> following
            </span>
          </div>
          <div className="mt-4">
            <div className="font-semibold">{fullName}</div>
            <div>{bio}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
