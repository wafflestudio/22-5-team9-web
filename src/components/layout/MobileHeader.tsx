import { MessageCircle } from 'lucide-react';

const MobileHeader = () => {
  return (
    <div className="md:hidden flex justify-between items-center mb-4">
      <span className="text-4xl font-bold font-['Dancing_Script'] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] inline-block text-transparent bg-clip-text">
        insnugram
      </span>
      <div className="flex space-x-4">
        <MessageCircle className="w-6 h-6" />
      </div>
    </div>
  );
};

export default MobileHeader;
