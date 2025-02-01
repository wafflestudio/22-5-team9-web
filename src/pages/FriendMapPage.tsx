import {
  BookIcon,
  BookOpen,
  Building2,
  GraduationCap,
  HomeIcon,
  Library,
  School,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  getLocationFriends,
  getMyLocation,
  setLocationStatus,
} from '../api/location';
import { fetchUserProfile } from '../api/profile';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import SearchModal from '../components/modals/SearchModal';
import { useSearch } from '../hooks/useSearch';
import type { UserProfile } from '../types/user';

const Mountain = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 50" className={className} fill="currentColor">
    <path d="M0 50 L30 10 L45 30 L60 5 L100 50 Z" />
  </svg>
);

interface Location {
  id: string;
  name: string;
  position: { x: number; y: number };
  users: UserProfile[];
  icon: React.ReactNode;
  tagId: number;
}

const locations: Location[] = [
  {
    id: 'upper-engineering',
    name: '윗공대',
    position: { x: 50, y: 10 },
    users: [],
    icon: <Building2 className="w-6 h-6" />,
    tagId: 10,
  },
  {
    id: 'engineering',
    name: '공대',
    position: { x: 55, y: 35 },
    users: [],
    icon: <School className="w-6 h-6" />,
    tagId: 9,
  },
  {
    id: 'agriculture',
    name: '농생대',
    position: { x: 70, y: 55 },
    users: [],
    icon: <BookOpen className="w-6 h-6" />,
    tagId: 8,
  },
  {
    id: 'science',
    name: '자연대',
    position: { x: 55, y: 50 },
    users: [],
    icon: <BookIcon className="w-6 h-6" />,
    tagId: 7,
  },
  {
    id: 'library',
    name: '중도',
    position: { x: 50, y: 60 },
    users: [],
    icon: <Library className="w-6 h-6" />,
    tagId: 6,
  },
  {
    id: 'humanities',
    name: '인문대',
    position: { x: 30, y: 55 },
    users: [],
    icon: <GraduationCap className="w-6 h-6" />,
    tagId: 5,
  },
  {
    id: 'education',
    name: '사범대',
    position: { x: 20, y: 75 },
    users: [],
    icon: <Users className="w-6 h-6" />,
    tagId: 4,
  },
  {
    id: 'social',
    name: '사회대',
    position: { x: 40, y: 70 },
    users: [],
    icon: <Building2 className="w-6 h-6" />,
    tagId: 3,
  },
  {
    id: 'entrance',
    name: '입구',
    position: { x: 60, y: 90 },
    users: [],
    icon: <HomeIcon className="w-6 h-6" />,
    tagId: 2,
  },
];

const LocationPin = ({
  location,
  onClick,
}: {
  location: Location;
  onClick: () => void;
}) => (
  <button
    className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform flex flex-col items-center"
    style={{ left: `${location.position.x}%`, top: `${location.position.y}%` }}
    onClick={onClick}
  >
    <div className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
      {location.icon}
    </div>
    <span className="text-xs font-bold mt-1 bg-white/80 px-2 rounded-full">
      {location.name}
    </span>
  </button>
);

const LocationPopup = ({
  location,
  onClose,
  onSetMyLocation,
  isCurrentLocation,
  users,
  isLoading,
}: {
  location: Location;
  onClose: () => void;
  onSetMyLocation: () => void;
  isCurrentLocation: boolean;
  users: UserProfile[];
  isLoading: boolean;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current != null &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute z-50 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
    >
      <div className="py-1">
        <div className="px-4 py-2 text-sm font-bold border-b">
          {location.name}
        </div>
        <button
          className="block w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-gray-100"
          onClick={onSetMyLocation}
        >
          {isCurrentLocation ? '위치 설정 끄기' : '내 위치로 설정하기'}
        </button>
        <div className="px-4 py-2 border-t">
          <div className="font-bold text-sm mb-2">현재 이 위치의 친구들</div>
          {isLoading ? (
            <div className="text-sm text-gray-500">로딩중...</div>
          ) : users.length > 0 ? (
            <div className="max-h-40 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user?.user_id}
                  className="flex items-center space-x-3 p-2 rounded-lg"
                >
                  <img
                    src={`https://waffle-instaclone.kro.kr/${user?.profile_image as string}`}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user?.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">아직 친구가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
};

const FriendMapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<number | null>(null);
  const [locationUsers, setLocationUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { isSearchOpen, setIsSearchOpen } = useSearch();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const myLocationTags = await getMyLocation();
        setUserLocation(myLocationTags as number);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    void fetchInitialData();
  }, []);

  const handleLocationClick = async (location: Location) => {
    setSelectedLocation(location);
    setIsLoadingUsers(true);
    try {
      const userIds = await getLocationFriends(location.tagId);
      const userProfiles = await Promise.all(
        userIds.map((id) => fetchUserProfile(id.toString())),
      );
      setLocationUsers(userProfiles);
    } catch (error) {
      console.error('Error fetching location users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSetMyLocation = async () => {
    if (selectedLocation == null) return;

    try {
      const isCurrentLocation = userLocation === selectedLocation.tagId;
      const success = await setLocationStatus(
        isCurrentLocation ? 1 : selectedLocation.tagId,
      );

      if (success) {
        if (isCurrentLocation) {
          setUserLocation(null);
          alert('위치 설정이 해제되었습니다');
        } else {
          setUserLocation(selectedLocation.tagId);
          alert(`${selectedLocation.name}으로 위치가 설정되었습니다`);
        }
      }
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error setting location:', error);
      alert('위치 설정에 실패했습니다');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />

      <div className="flex-1 md:ml-64 flex flex-col">
        <div className="flex-1 flex flex-col p-4 pb-16 md:pb-4">
          <MobileHeader />

          <div className="flex-1 flex justify-center">
            <div className="flex-1 relative bg-green-50 rounded-lg shadow-md overflow-hidden mt-4 max-w-3xl">
              <Mountain className="absolute bottom-0 left-0 w-full h-48 text-green-200" />
              <Mountain className="absolute bottom-10 left-10 w-96 h-32 text-green-200" />
              <Mountain className="absolute bottom-5 right-0 w-80 h-40 text-green-200" />

              {locations.map((location) => (
                <LocationPin
                  key={location.id}
                  location={location}
                  onClick={() => {
                    void handleLocationClick(location);
                  }}
                />
              ))}

              {selectedLocation != null && (
                <LocationPopup
                  location={selectedLocation}
                  onClose={() => {
                    setSelectedLocation(null);
                  }}
                  onSetMyLocation={() => {
                    void handleSetMyLocation();
                  }}
                  isCurrentLocation={userLocation === selectedLocation.tagId}
                  users={locationUsers}
                  isLoading={isLoadingUsers}
                />
              )}
            </div>
          </div>
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

export default FriendMapPage;
