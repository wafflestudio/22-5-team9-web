import { Compass, Home, Map, PlusSquare, User } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { LoginContext } from '../../App';
import CreatePostModal from '../modals/CreatePostModal';
import { NavItem } from './NavItem';

const MobileBar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    } else if (path === '/map') {
      setActiveItem('map');
    } else if (path === `/${String(context.myProfile?.username)}`) {
      setActiveItem('profile');
    } else {
      setActiveItem('');
    }
  }, [location.pathname, context.myProfile?.username]);

  const handleCreateClick = () => {
    setActiveItem('create');
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <nav className="flex md:hidden justify-around py-2 bg-white border-t fixed bottom-0 w-full">
        <NavItem
          icon={
            <Home size={24} strokeWidth={activeItem === 'home' ? 2.5 : 1.5} />
          }
          to="/"
          mobile
          active={activeItem === 'home'}
        />
        <NavItem
          icon={
            <Compass
              size={24}
              strokeWidth={activeItem === 'explore' ? 2.5 : 1.5}
            />
          }
          to="/explore"
          mobile
          active={activeItem === 'explore'}
        />
        <NavItem
          icon={
            <PlusSquare
              size={24}
              strokeWidth={activeItem === 'create' ? 2.5 : 1.5}
            />
          }
          mobile
          active={activeItem === 'create'}
          onClick={handleCreateClick}
        />
        <NavItem
          icon={
            <Map size={24} strokeWidth={activeItem === 'map' ? 2.5 : 1.5} />
          }
          to="/map"
          mobile
          active={activeItem === 'map'}
        />
        <NavItem
          icon={
            <User
              size={24}
              strokeWidth={activeItem === 'profile' ? 2.5 : 1.5}
            />
          }
          to={`/${String(context.myProfile?.username)}`}
          mobile
          active={activeItem === 'profile'}
        />
      </nav>
      {isCreateModalOpen && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default MobileBar;
