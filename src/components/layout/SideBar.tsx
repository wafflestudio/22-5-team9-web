import {
  Compass,
  Home,
  Map,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  User,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { LoginContext } from '../../App';
import { NavItem } from './NavItem';

interface SideBarProps {
  onSearchClick: () => void;
}

const SideBar = ({ onSearchClick }: SideBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [, setIsCreateModalOpen] = useState(false);
  const location = useLocation();

  const context = useContext(LoginContext);

  if (context === null) {
    throw new Error('LoginContext is not provided');
  }

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveItem('home');
    } else if (path === '/explore') {
      setActiveItem('explore');
    } else if (path === '/messages') {
      setActiveItem('messages');
    } else if (path === '/map') {
      setActiveItem('map');
    } else if (path === `/${String(context.myProfile?.username)}`) {
      setActiveItem('profile');
    } else {
      setActiveItem('');
    }
  }, [location.pathname, context.myProfile?.username]);

  const handleCreateClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="hidden md:flex md:flex-col h-full px-4 py-8">
      <div className="mb-8">
        <span className="text-4xl font-bold font-['Dancing_Script'] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] inline-block text-transparent bg-clip-text">
          insnugram
        </span>
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <Link to="/">
          <NavItem
            icon={<Home />}
            label="Home"
            active={activeItem === 'home'}
          />
        </Link>
        <NavItem
          icon={<Search />}
          label="Search"
          active={activeItem === 'search'}
          onClick={() => {
            onSearchClick();
          }}
        />
        <Link to="/explore">
          <NavItem
            icon={<Compass />}
            label="Explore"
            active={activeItem === 'explore'}
          />
        </Link>
        <Link to="/messages">
          <NavItem
            icon={<MessageCircle />}
            label="Messages"
            active={activeItem === 'messages'}
          />
        </Link>
        <Link to="/map">
          <NavItem icon={<Map />} label="Map" active={activeItem === 'map'} />
        </Link>
        <NavItem
          icon={<PlusSquare />}
          label="Create"
          onClick={() => {
            handleCreateClick('create');
          }}
        />
        <Link to={`/${String(context.myProfile?.username)}`}>
          <NavItem
            icon={<User />}
            label="Profile"
            active={activeItem === 'profile'}
          />
        </Link>
      </div>

      <div className="relative mt-auto">
        <NavItem
          icon={<Menu />}
          label="More"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        />
        {isMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  context.handleIsLoggedIn(false, null);
                  setIsMenuOpen(false);
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
