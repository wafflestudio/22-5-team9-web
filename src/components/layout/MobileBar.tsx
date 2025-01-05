import { Compass, Heart, Home, PlusSquare, User } from 'lucide-react';

import { NavItem } from './NavItem';

const MobileBar = () => {
  return (
    <nav className="flex md:hidden justify-around py-2 bg-white border-t">
      <NavItem icon={<Home />} to="/" mobile />
      <NavItem icon={<Compass />} to="/explore" mobile />
      <NavItem icon={<PlusSquare />} mobile />
      <NavItem icon={<Heart />} mobile />
      <NavItem icon={<User />} to="/username" mobile />
    </nav>
  );
};

export default MobileBar;
