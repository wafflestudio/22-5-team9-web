import { Compass, Home, PlusSquare, Search, User } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { LoginContext } from '../../App';
import CreatePostModal from '../modals/CreatePostModal';
import { NavItem } from './NavItem';

interface MobileBarProps {
  onSearchClick: () => void;
}

const MobileBar = ({ onSearchClick }: MobileBarProps) => {
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
        <NavItem icon={<Home />} to="/" mobile active={activeItem === 'home'} />
        <NavItem
          icon={<Search />}
          mobile
          active={activeItem === 'search'}
          onClick={onSearchClick}
        />
        <NavItem
          icon={<Compass />}
          to="/explore"
          mobile
          active={activeItem === 'explore'}
        />
        <NavItem
          icon={<PlusSquare />}
          mobile
          active={activeItem === 'create'}
          onClick={handleCreateClick}
        />
        <NavItem
          icon={<User />}
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
