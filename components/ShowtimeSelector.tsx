import React from 'react';
import { Movie, Showtime } from '../types';
import { SHOWTIMES } from '../constants';
import { Calendar, MonitorPlay } from 'lucide-react';

interface ShowtimeSelectorProps {
  movie: Movie;
  onSelect: (time: Showtime) => void;
}

export const ShowtimeSelector: React.FC<ShowtimeSelectorProps> = ({ movie, onSelect }) => {
  // Group showtimes by date
  const groupedTimes = SHOWTIMES.reduce((acc, showtime) => {
    if (!acc[showtime.date]) acc[showtime.date] = [];
    acc[showtime.date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  return (
    <div className="flex flex-col h-full">
      {/* Movie Summary Header */}
      <div className="flex gap-4 mb-6">
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className="w-20 h-28 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1 py-1">
          <h2 className="text-xl font-bold text-white mb-1">{movie.title}</h2>
          <p className="text-gray-400 text-sm mb-3">{movie.genre} • {movie.duration}</p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
             <Calendar size={14} className="text-gray-400"/>
             <span className="text-xs text-gray-300">Select a time</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTimes).map(([date, times]) => (
          <div key={date}>
            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-3 ml-1">
              {date}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {times.map((showtime) => (
                <button
                  key={showtime.id}
                  onClick={() => onSelect(showtime)}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-white/10 bg-dark-surface hover:bg-brand-900/30 hover:border-brand-500/50 transition-all duration-200 active:scale-95"
                >
                  <span className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                    {showtime.time}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 group-hover:text-gray-400">
                    <MonitorPlay size={10} />
                    <span>{showtime.experience}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};