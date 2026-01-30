import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Seat, SeatStatus } from '../types';
import { ROWS, COLS_PER_ROW } from '../constants';
import { Button } from './Button';

interface SeatMapProps {
  movie: Movie;
  showtime: Showtime;
  onConfirm: (seats: Seat[]) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ movie, showtime, onConfirm }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  
  // Initialize mock seat data on mount
  useEffect(() => {
    const generatedSeats: Seat[] = [];
    ROWS.forEach((row) => {
      for (let col = 1; col <= COLS_PER_ROW; col++) {
        // Randomly assign occupied status
        const isOccupied = Math.random() < 0.3; // 30% chance occupied
        generatedSeats.push({
          id: `${row}${col}`,
          row,
          col,
          status: isOccupied ? SeatStatus.OCCUPIED : SeatStatus.AVAILABLE,
          price: 12.50,
        });
      }
    });
    setSeats(generatedSeats);
  }, [movie.id, showtime.id]);

  const toggleSeat = (seatId: string) => {
    setSeats(currentSeats => 
      currentSeats.map(seat => {
        if (seat.id !== seatId) return seat;
        if (seat.status === SeatStatus.OCCUPIED) return seat;
        
        // Toggle between SELECTED and AVAILABLE
        return {
          ...seat,
          status: seat.status === SeatStatus.SELECTED ? SeatStatus.AVAILABLE : SeatStatus.SELECTED
        };
      })
    );
  };

  const selectedSeats = seats.filter(s => s.status === SeatStatus.SELECTED);
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="flex flex-col h-full relative">
      <div className="text-center mb-6">
        <h2 className="text-white font-bold text-lg">{movie.title}</h2>
        <p className="text-gray-400 text-sm mb-1">
          {showtime.date} • {showtime.time} • {showtime.experience}
        </p>
        <p className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
           {showtime.theater}
        </p>
      </div>

      {/* Screen Visualization */}
      <div className="w-full mb-10 perspective-500 group">
        <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent rounded-full blur-[2px] shadow-[0_10px_40px_-5px_rgba(255,51,133,0.3)] mb-2" />
        <div className="w-full mx-auto h-8 border-t-4 border-white/10 rounded-t-[50%] flex items-center justify-center text-xs text-gray-600 tracking-widest uppercase opacity-50">
          Screen
        </div>
      </div>

      {/* Seats Grid */}
      <div className="flex-1 flex justify-center overflow-x-auto no-scrollbar pb-20">
        <div className="grid gap-y-3 gap-x-1.5 sm:gap-x-3 mb-8 mx-auto">
          {ROWS.map(row => (
            <div key={row} className="flex items-center gap-2 sm:gap-4">
              <span className="text-gray-600 text-xs w-4 font-mono">{row}</span>
              <div className="flex gap-1.5 sm:gap-3">
                {seats.filter(s => s.row === row).map(seat => {
                  let bgColor = "bg-gray-700"; // Available
                  let cursor = "cursor-pointer active:scale-90 hover:bg-gray-600";
                  
                  if (seat.status === SeatStatus.OCCUPIED) {
                    bgColor = "bg-white/5 border border-white/5 opacity-50";
                    cursor = "cursor-not-allowed";
                  } else if (seat.status === SeatStatus.SELECTED) {
                    // Update shadow to match new pink brand-500 (#ff3385 is roughly 255, 51, 133)
                    bgColor = "bg-brand-500 shadow-[0_0_10px_2px_rgba(255,51,133,0.4)] border border-brand-400";
                    cursor = "cursor-pointer active:scale-95";
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                      disabled={seat.status === SeatStatus.OCCUPIED}
                      className={`
                        w-7 h-7 sm:w-9 sm:h-9 rounded-t-lg rounded-b-sm transition-all duration-200
                        ${bgColor} ${cursor}
                      `}
                      aria-label={`${seat.row}${seat.col} ${seat.status}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-24 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded-sm" /> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-brand-500 rounded-sm" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/10 rounded-sm opacity-50" /> Taken
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-xl border-t border-white/10 p-4 max-w-lg mx-auto pb-8 z-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-gray-400 text-xs block">Total Price</span>
            <span className="text-xl font-bold text-white">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="text-right">
             <span className="text-gray-400 text-xs block">Seats</span>
             <span className="text-white text-sm font-medium">
               {selectedSeats.length > 0 ? selectedSeats.map(s => `${s.row}${s.col}`).join(', ') : '-'}
             </span>
          </div>
        </div>
        <Button 
          onClick={() => onConfirm(selectedSeats)} 
          disabled={selectedSeats.length === 0}
          fullWidth
        >
          {selectedSeats.length > 0 ? 'Next: Add Snacks' : 'Select Seats'}
        </Button>
      </div>
    </div>
  );
};