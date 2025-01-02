import { useParams } from 'react-router-dom';

import Highlights from '../components/Highlights';
import MobileBar from '../components/MobileBar';
import MobileHeader from '../components/MobileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ProfileTabs from '../components/ProfileTabs';
import SideBar from '../components/SideBar';

const ProfilePage = () => {
  const { username } = useParams();
  const profileData = {
    username: username as string,
    posts: 4,
    followers: 100,
    following: 100,
    fullName: 'User1',
    bio: 'User1 Bio',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <ProfileInfo {...profileData} />
          <div className="hidden md:block mb-4">
            <h2 className="font-semibold">{profileData.fullName}</h2>
            <p>{profileData.bio}</p>
          </div>
          <Highlights />
          <ProfileTabs />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar />
        <MobileBar />
      </div>
    </div>
  );
};

export default ProfilePage;
