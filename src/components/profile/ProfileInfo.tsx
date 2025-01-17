import { Link as LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FollowButton from './FollowButton';

interface ProfileInfoProps {
  userId: number;
  username: string;
  posts: number;
  followers: number;
  following: number;
  fullName: string;
  bio: string;
  website: string | null;
  profileImage: string;
}

const ProfileInfo = ({
  userId,
  username,
  posts,
  followers,
  following,
  fullName,
  bio,
  website,
  profileImage,
}: ProfileInfoProps) => {
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentFollowers, setCurrentFollowers] = useState(followers);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token === null) {
          void navigate('/');
          return;
        }

        const response = await fetch('http://3.34.185.81:8000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        interface UserProfile {
          user_id: number;
        }
        
        const data: UserProfile = await response.json() as UserProfile;
        setIsCurrentUser(data.user_id === userId);
      } catch (error) {
        console.error('Error checking current user:', error);
      }
    };

    void checkCurrentUser();
  }, [userId, navigate]);

  const handleFollowChange = (isFollowing: boolean) => {
    setCurrentFollowers((prev) => (isFollowing ? prev + 1 : prev - 1));
  };

  const handleEditProfile = () => {
    void navigate(`/settings`);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8 flex-shrink-0">
          <img
            src={profileImage.length > 0 ? profileImage : '/placeholder.svg'}
            alt={username}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
            <h2 className="text-xl mb-4 md:mb-0">{username}</h2>
            <div className="flex justify-center md:justify-start space-x-2">
              {isCurrentUser ? (
                <button
                  onClick={handleEditProfile}
                  className="bg-gray-100 px-4 py-1.5 rounded font-medium text-sm"
                >
                  Edit Profile
                </button>
              ) : (
                <FollowButton userId={userId} onFollowChange={handleFollowChange} />
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 mb-4">
            <div>
              <span className="font-semibold">{posts}</span>
              <span className="ml-1 text-gray-700">posts</span>
            </div>
            <div>
              <span className="font-semibold">{currentFollowers}</span>
              <span className="ml-1 text-gray-700">followers</span>
            </div>
            <div>
              <span className="font-semibold">{following}</span>
              <span className="ml-1 text-gray-700">following</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-semibold">{fullName}</h1>
            {bio.length > 0 && <p className="whitespace-pre-line">{bio}</p>}
            {website !== null && website.length > 0 && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 font-medium flex items-center justify-center md:justify-start"
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                {website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;