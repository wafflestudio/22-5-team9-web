import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchUserData } from '../api/userData';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import Highlights from '../components/profile/Highlights';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import type { UserProfile } from '../types/user';

const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (username == null) return;
      
      try {
        setLoading(true);
        const userData = await fetchUserData(username);
        setProfileData(userData);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    void loadUserProfile();
  }, [username]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error != null || profileData == null) {
    return <div className="flex justify-center items-center min-h-screen">Failed to load profile</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <ProfileInfo
            username={profileData.username}
            posts={profileData.post_count}
            followers={profileData.follower_count}
            following={profileData.following_count}
            fullName={profileData.full_name}
            bio={profileData.introduce}
            profileImage={profileData.profile_image}
          />
          <div className="hidden md:block mb-4">
            <h2 className="font-semibold">{profileData.full_name}</h2>
            <p>{profileData.introduce}</p>
          </div>
          <Highlights />
          <ProfileTabs postIds={profileData.post_ids} />
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