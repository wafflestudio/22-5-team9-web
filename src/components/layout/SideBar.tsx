import {
  Compass,
  Heart,
  Home,
  Menu,
  PlusSquare,
  Search,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NavItem } from './NavItem';

const SideBar = () => {
  //  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const auth = useAuth();

  const handleLogoutClick = () => {
    localStorage.clear();
    setIsMenuOpen(false);
    auth.handleLogout();
  };

  return (
    <div className="hidden md:flex md:flex-col h-full px-4 py-8">
      <div className="mb-8">
        <img src="/instagram-logo.png" alt="Instagram" className="w-24" />
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <Link to="/">
          <NavItem icon={<Home />} label="Home" active />
        </Link>
        <NavItem icon={<Search />} label="Search" active={false} />
        <Link to="/explore">
          <NavItem icon={<Compass />} label="Explore" active={false} />
        </Link>
        <NavItem icon={<Heart />} label="Notifications" active={false} />
        <NavItem icon={<PlusSquare />} label="Create" active={false} />
        <Link to="/username">
          <NavItem icon={<User />} label="Profile" active={false} />
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
                onClick={handleLogoutClick}
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
