import React from 'react';
import { MOVIES } from '../constants';
import { Movie } from '../types';
import { Star, Clock } from 'lucide-react';

interface MovieListProps {
  onSelect: (movie: Movie) => void;
}

export const MovieList: React.FC<MovieListProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4 pb-4">
      {MOVIES.map((movie) => (
        <div 
          key={movie.id}
          onClick={() => onSelect(movie)}
          className="group relative bg-dark-surface rounded-xl overflow-hidden border border-white/5 hover:border-brand-500/50 transition-all cursor-pointer shadow-lg hover:shadow-brand-900/40"
        >
          {/* Image Container */}
          <div className="aspect-[2/3] w-full relative overflow-hidden">
            <img 
              src={movie.imageUrl} 
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-80" />
            
            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold">{movie.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 absolute bottom-0 w-full">
            <h3 className="text-white font-bold leading-tight mb-1 truncate">{movie.title}</h3>
            <p className="text-gray-400 text-xs mb-2 truncate">{movie.genre}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock size={12} />
                <span>{movie.duration}</span>
              </div>
              <span className="text-brand-400 text-xs font-semibold group-hover:underline">
                Book
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};