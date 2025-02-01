import { Heart, MessageCircle } from 'lucide-react';

const MobileHeader = () => {
  return (
    <div className="md:hidden flex justify-between items-center mb-4">
      <img src="/instagram-logo.png" alt="Instagram" className="w-24" />
      <div className="flex space-x-4">
        <Heart className="w-6 h-6" />
        <MessageCircle className="w-6 h-6" />
      </div>
    </div>
  );
};

export default MobileHeader;
