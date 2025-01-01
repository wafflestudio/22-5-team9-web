import { Heart, Home, PlusSquare, Search, User } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
}

const NavItem = ({ icon }: NavItemProps) => (
  <a href="#" className="flex items-center justify-center p-2">
    {icon}
  </a>
);

const BottomBar = () => {
  return (
    <nav className="flex md:hidden justify-around py-2 bg-white border-t">
      <Link to="/">
        <NavItem icon={<Home />} />
      </Link>
      <NavItem icon={<Search />} />
      <NavItem icon={<PlusSquare />} />
      <NavItem icon={<Heart />} />
      <Link to="/username">
        <NavItem icon={<User />} />
      </Link>
    </nav>
  );
};

export default BottomBar;
