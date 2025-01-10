import {
  Compass,
  Heart,
  Home,
  Menu,
  PlusSquare,
  Search,
  User,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { LoginContext } from '../../App';
import CreatePostModal from '../modals/CreatePostModal';
import { NavItem } from './NavItem';

const SideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const context = useContext(LoginContext);

  if (context === null) {
    throw new Error('LoginContext is not provided');
  }

  const handleNavItemClick = (itemName: string) => {
    setActiveItem(itemName);
    if (itemName === 'create') {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="hidden md:flex md:flex-col h-full px-4 py-8">
      <div className="mb-8">
        <img
          src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/apple-small/1f9c7@2x.png"
          alt="Logo"
          className="w-16"
        />
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <Link
          to="/"
          onClick={() => {
            handleNavItemClick('home');
          }}
        >
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
            handleNavItemClick('search');
          }}
        />
        <Link
          to="/explore"
          onClick={() => {
            handleNavItemClick('explore');
          }}
        >
          <NavItem
            icon={<Compass />}
            label="Explore"
            active={activeItem === 'explore'}
          />
        </Link>
        <NavItem
          icon={<Heart />}
          label="Notifications"
          active={activeItem === 'notifications'}
          onClick={() => {
            handleNavItemClick('notifications');
          }}
        />
        <NavItem
          icon={<PlusSquare />}
          label="Create"
          active={activeItem === 'create'}
          onClick={() => {
            handleNavItemClick('create');
          }}
        />
        {isCreateModalOpen && (
          <CreatePostModal
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
            }}
          />
        )}
        <Link
          to="/username"
          onClick={() => {
            handleNavItemClick('profile');
          }}
        >
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
                  context.handleIsLoggedIn(false);
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
