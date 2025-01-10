import MobileBar from '../components/layout/MobileBar';
import SideBar from '../components/layout/SideBar';
import PostGrid from '../components/shared/PostGrid';

const ExplorePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <PostGrid />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar />
        <MobileBar />
      </div>
    </div>
  );
};

export default ExplorePage;
