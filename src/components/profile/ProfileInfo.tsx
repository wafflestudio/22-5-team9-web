import { Settings } from 'lucide-react';

type ProfileInfoProps = {
  username: string;
  profileImage: string;
  posts: number;
  followers: number;
  following: number;
  fullName: string;
  bio: string;
};

const ProfileInfo = ({
  username,
  profileImage,
  posts,
  followers,
  following,
  fullName,
  bio,
}: ProfileInfoProps) => {
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
            <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-semibold mr-2">
              Follow
            </button>
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
        </div>
      </div>
      <div className="md:hidden">
        <h2 className="font-semibold">{fullName}</h2>
        <p>{bio}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
