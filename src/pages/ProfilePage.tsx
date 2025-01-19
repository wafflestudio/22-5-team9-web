import { useParams } from 'react-router-dom';

import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import Highlights from '../components/profile/Highlights';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import { ErrorDisplay } from '../components/shared/ErrorDisplay';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { NotFound } from '../components/shared/NotFound';
import { useProfile } from '../hooks/useProfile';

const ProfilePage = ({ currentUserId }: { currentUserId: number | null }) => {
  const { username } = useParams<{ username: string }>();
  const { profile, isLoading, error } = useProfile(username ?? '');

  if (isLoading) return <LoadingSpinner />;
  if (error !== null) return <ErrorDisplay message={error} />;
  if (profile === null) return <NotFound />;

  const isOwner = currentUserId === profile.user_id;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <ProfileInfo
            userId={profile.user_id}
            posts={profile.post_count}
            fullName={profile.full_name}
            bio={profile.introduce ?? ''}
            isOwner={isOwner}
            {...profile}
          />
          <div className="hidden md:block mb-4">
            <h2 className="font-semibold">{profile.full_name}</h2>
            <p>{profile.introduce}</p>
          </div>
          <Highlights userId={profile.user_id} isOwner={isOwner} />
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
