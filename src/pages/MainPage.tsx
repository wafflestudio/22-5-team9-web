import BottomBar from '../components/MobileBar';
import MobileHeader from '../components/MobileHeader';
import Posts from '../components/Posts';
import SideBar from '../components/SideBar';
import Stories from '../components/Stories';

const dummyPosts = [
  {
    id: 1,
    username: 'user1',
    imageUrl: '/placeholder.svg',
    caption: 'This is a sample post',
    likes: 1000,
    comments: 100,
    timestamp: '1 HOUR AGO',
  },
  {
    id: 2,
    username: 'user2',
    imageUrl: '/placeholder.svg',
    caption: 'Another sample post',
    likes: 1500,
    comments: 150,
    timestamp: '2 HOURS AGO',
  },
  {
    id: 3,
    username: 'user3',
    imageUrl: '/placeholder.svg',
    caption: 'Yet another sample post',
    likes: 2000,
    comments: 200,
    timestamp: '3 HOURS AGO',
  },
  {
    id: 4,
    username: 'user4',
    imageUrl: '/placeholder.svg',
    caption: 'Fourth sample post',
    likes: 2500,
    comments: 250,
    timestamp: '4 HOURS AGO',
  },
  {
    id: 5,
    username: 'user5',
    imageUrl: '/placeholder.svg',
    caption: 'Fifth sample post',
    likes: 3000,
    comments: 300,
    timestamp: '5 HOURS AGO',
  },
  {
    id: 6,
    username: 'user6',
    imageUrl: '/placeholder.svg',
    caption: 'Sixth sample post',
    likes: 3500,
    comments: 350,
    timestamp: '6 HOURS AGO',
  },
];

const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <Stories />
          <Posts posts={dummyPosts} postsPerPage={5} />
          <div className="text-xs text-gray-400 mt-8 mb-16 md:mb-4">
            <p>© INSTAGRAM</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar />
        <BottomBar />
      </div>
    </div>
  );
};

export default MainPage;
