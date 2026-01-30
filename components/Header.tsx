import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Film, Ticket, LogOut, User } from 'lucide-react';
import { Step } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentStep: Step;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onBack }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-white/10 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-10" /> // Spacer
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-brand-500 p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
          <Film size={20} className="text-white" />
        </div>
        <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-white via-brand-100 to-brand-300 bg-clip-text text-transparent">
          CineSwift
        </h1>
      </div>

      {/* Profile Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-brand-900 border border-white/10 flex items-center justify-center hover:border-brand-500 transition-colors"
        >
          <User size={16} className="text-gray-300" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-10 bg-dark-surface border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px] z-50">
            <button
              onClick={() => { navigate('/my-bookings'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"
            >
              <Ticket size={14} />
              My Bookings
            </button>
            <hr className="border-white/10 my-1" />
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gray-800 w-full">
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,51,133,0.5)]"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        />
      </div>
    </header>
  );
};