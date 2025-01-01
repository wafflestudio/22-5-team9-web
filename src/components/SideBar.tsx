import {
  Compass,
  Heart,
  Home,
  Menu,
  PlusSquare,
  Search,
  User,
} from 'lucide-react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { LoginContext, type LoginContextType } from '../App';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => (
  <a
    href="#"
    className={`flex items-center p-2 rounded-md ${active ? 'font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
  >
    {icon}
    {<span className="ml-4 hidden md:inline">{label}</span>}
  </a>
);

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const context = useContext(LoginContext) as LoginContextType;
  const handleIsLoggedIn = context.handleIsLoggedIn;

  return (
    <div className="hidden md:flex md:flex-col h-full px-4 py-8">
      <div className="mb-8">
        <img src="/instagram-logo.png" alt="Instagram" className="w-24" />
      </div>
      <div className="flex flex-col flex-1 space-y-2">
        <Link to="/" className="no-underline">
          <NavItem icon={<Home />} label="Home" active />
        </Link>
        <NavItem icon={<Search />} label="Search" active={false} />
        <NavItem icon={<Compass />} label="Explore" active={false} />
        <NavItem icon={<Heart />} label="Notifications" active={false} />
        <NavItem icon={<PlusSquare />} label="Create" active={false} />
        <Link to="/username" className="no-underline">
          <NavItem icon={<User />} label="Profile" active={false} />
        </Link>
      </div>
      <div className="relative mt-auto">
        <button
          onClick={toggleMenu}
          className="flex items-center p-2 w-full hover:bg-gray-100 rounded-md"
        >
          <Menu />
          <span className="ml-4 hidden md:inline">More</span>
        </button>
        {isMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  // TODO: 로그아웃 로직 구현
                  handleIsLoggedIn(false);
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

export default Sidebar;
