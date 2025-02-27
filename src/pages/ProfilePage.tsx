import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchUserProfile } from '../api/profile';
import { LoginContext } from '../App';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import SearchModal from '../components/modals/SearchModal';
// import Highlights from '../components/profile/Highlights';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import { useSearch } from '../hooks/useSearch';
import type { UserProfile } from '../types/user';

const ProfilePage = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const context = useContext(LoginContext);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (username == null) return;

      try {
        setLoading(true);
        const userData = await fetchUserProfile(username);
        setUserProfile(userData);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    void loadUserProfile();
  }, [username, context]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error != null || userProfile == null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <ProfileInfo
            userId={userProfile.user_id}
            username={userProfile.username}
            profileImage={userProfile.profile_image}
            posts={userProfile.post_count}
            followers={userProfile.follower_count}
            following={userProfile.following_count}
            fullName={userProfile.full_name}
            bio={userProfile.introduce}
          />
          <ProfileTabs postIds={userProfile.post_ids} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar
          onSearchClick={() => {
            setIsSearchOpen(true);
          }}
        />
        <MobileBar />
      </div>
    </div>
  );
};

export default ProfilePage;
