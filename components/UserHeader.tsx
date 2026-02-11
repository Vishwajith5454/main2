
import React from 'react';
import { Plus } from 'lucide-react';

interface UserHeaderProps {
  onOpenCreator: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onOpenCreator }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-[2px]">
      {/* Brand Logo Area */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
          <span className="text-xl font-bold text-white">VS</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-lg font-bold text-white leading-none">Vishwajith</h1>
          <span className="text-xs text-blue-300 font-medium tracking-widest uppercase">Solutions</span>
        </div>
      </div>

      {/* Add Button */}
      <button 
        onClick={onOpenCreator}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-blue-600/20 text-blue-300 hover:text-white border border-blue-500/30 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-semibold">Add Solution</span>
      </button>
    </header>
  );
};

export default UserHeader;
