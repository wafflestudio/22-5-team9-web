import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import Highlights from '../components/profile/Highlights';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import type { UserProfile } from '../types/user';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (username === undefined) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token');

        if (token === null) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `http://3.34.185.81:8000/api/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = (await response.json()) as UserProfile;
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error !== null || profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          Error: {error ?? 'Profile not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <MobileHeader />
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-6 h-6" />
            </button>
          </div>
          <ProfileInfo
            userId={profile.user_id}
            username={profile.username}
            posts={profile.post_count}
            followers={profile.follower_count}
            following={profile.following_count}
            fullName={profile.full_name}
            bio={profile.introduce ?? ''}
            website={profile.website}
            profileImage={profile.profile_image}
          />
          <Highlights />
          <ProfileTabs postIds={profile.post_ids} />
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
