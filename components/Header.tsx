import React from 'react';
import { ChevronLeft, Film } from 'lucide-react';
import { Step } from '../types';

interface HeaderProps {
  currentStep: Step;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onBack }) => {
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

      <div className="w-10 flex justify-end">
        {/* Placeholder for profile or other action */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-brand-900 border border-white/10" />
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