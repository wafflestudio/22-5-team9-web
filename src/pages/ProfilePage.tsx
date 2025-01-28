import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import Highlights from '../components/profile/Highlights';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import type { UserProfile } from '../types/user';

interface ProfilePageProps {
  currentUserId: number | null;
}

const ProfilePage = ({ currentUserId }: ProfilePageProps) => {
  const { username } = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile>({
    username: username as string,
    user_id: 1,
    post_count: 4,
    followers: 100,
    following: 100,
    full_name: 'User1',
    introduce: 'User1 Bio',
    email: '',
    phone_number: '',
    creation_date: '',
    profile_image: '',
    website: '',
    gender: '',
    birthday: '',
    post_ids: [],
  });
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data based on username
        // Replace this with your actual API call
        if (username == null) {
          throw new Error('Username is undefined');
        }
        const response = await fetch(
          `https://waffle-instaclone.kro.kr/api/user/${username}`,
        );
        if (response.ok) {
          const data: UserProfile = (await response.json()) as UserProfile;
          setProfileData({
            username: data.username,
            post_count: data.post_count,
            followers: data.followers,
            following: data.following,
            full_name: data.full_name,
            introduce: data.introduce ?? '',
            user_id: data.user_id,
            email: data.email,
            phone_number: data.phone_number,
            creation_date: data.creation_date,
            profile_image: data.profile_image,
            website: data.website ?? '',
            gender: data.gender ?? '',
            birthday: data.birthday ?? '',
            post_ids: data.post_ids,
          });
        } else {
          const errorData = (await response.json()) as { detail?: string }; // Possible error structure
          const errorMessage =
            errorData.detail ?? 'Failed to fetch profile data';
          setError(errorMessage);
        }
      } catch {
        setError('An error occurred while fetching profile data');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfileData();
  }, [username]);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator
  }

  if (error != null) {
    return <div>Error: {error}</div>; // Render an error message
  }

  const isOwner = currentUserId === profileData.user_id;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <ProfileInfo
            userId={0}
            posts={0}
            fullName={''}
            bio={''}
            isOwner={isOwner}
            {...profileData}
          />
          <div className="hidden md:block mb-4">
            <h2 className="font-semibold">{profileData.full_name}</h2>
            <p>{profileData.introduce}</p>
          </div>
          <Highlights userId={0} isOwner={isOwner} />
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
