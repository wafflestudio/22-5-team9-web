import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: ReactNode;
  label?: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
  mobile?: boolean;
}

export const NavItem = ({
  icon,
  label,
  active = false,
  to,
  onClick,
  mobile = false,
}: NavItemProps) => {
  const className = mobile
    ? 'flex items-center justify-center p-2'
    : `flex items-center p-2 rounded-md ${
        active ? 'font-bold' : 'text-gray-700 hover:bg-gray-100'
      }`;

  const content = (
    <>
      {icon}
      {!mobile && label != null && (
        <span className="ml-4 hidden md:inline">{label}</span>
      )}
    </>
  );

  if (to != null) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};
