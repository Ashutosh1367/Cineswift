import React from 'react';
import { BookingState } from '../types';
import { Button } from './Button';
import { CheckCircle2, QrCode, Share2, Home } from 'lucide-react';

interface Props {
  state: BookingState;
  onHome: () => void;
}

export const BookingConfirmation: React.FC<Props> = ({ state, onHome }) => {
  const { selectedMovie, selectedShowtime, selectedSeats, bookingId } = state;

  if (!selectedMovie || !selectedShowtime) return null;

  return (
    <div className="flex flex-col items-center pt-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Booking Confirmed!</h2>
        <p className="text-gray-400 text-sm">See you at the movies.</p>
      </div>

      {/* Ticket Card */}
      <div className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl mb-8 text-gray-900 relative">
        {/* Top: Movie Image/Gradient */}
        <div className="h-32 relative overflow-hidden">
          <img src={selectedMovie.imageUrl} className="w-full h-full object-cover blur-sm opacity-50 scale-110" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          <div className="absolute bottom-4 left-6">
             <h3 className="text-xl font-bold leading-none mb-1">{selectedMovie.title}</h3>
             <p className="text-sm text-gray-600 font-medium">{selectedShowtime.experience}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm mb-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Date</p>
              <p className="font-bold">{selectedShowtime.date}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Time</p>
              <p className="font-bold">{selectedShowtime.time}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Theater</p>
              <p className="font-bold truncate">{selectedShowtime.theater}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Seats</p>
              <p className="font-bold text-brand-600 break-words">
                {selectedSeats.map(s => `${s.row}${s.col}`).join(', ')}
              </p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 my-6 relative">
             <div className="absolute -left-9 -top-3 w-6 h-6 bg-dark-bg rounded-full" />
             <div className="absolute -right-9 -top-3 w-6 h-6 bg-dark-bg rounded-full" />
          </div>

          <div className="flex flex-col items-center">
            <QrCode className="w-24 h-24 text-gray-800 mb-2" />
            <p className="text-xs text-gray-400 font-mono tracking-widest">{bookingId}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <Button variant="secondary" fullWidth icon={<Share2 size={18} />}>
          Share with Friends
        </Button>
        <Button variant="outline" fullWidth onClick={onHome} icon={<Home size={18} />}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};