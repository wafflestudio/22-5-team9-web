import { Compass, Heart, Home, PlusSquare, User } from 'lucide-react';
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

const MobileBar = () => {
  return (
    <nav className="flex md:hidden justify-around py-2 bg-white border-t">
      <Link to="/">
        <NavItem icon={<Home />} />
      </Link>
      <Link to="/explore">
        <NavItem icon={<Compass />} />
      </Link>
      <NavItem icon={<PlusSquare />} />
      <NavItem icon={<Heart />} />
      <Link to="/username">
        <NavItem icon={<User />} />
      </Link>
    </nav>
  );
};

export default MobileBar;
