import MobileBar from '../components/layout/MobileBar';
import SideBar from '../components/layout/SideBar';
import ProfileEditForm from '../components/profile/ProfileEditForm';

const ProfileEditPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 md:ml-64 flex items-stretch justify-center">
        <div className="w-full max-w-3xl">
          <ProfileEditForm />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar />
        <MobileBar />
      </div>
    </div>
  );
};

export default ProfileEditPage;
