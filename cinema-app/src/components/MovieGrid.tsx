
import React from 'react';
import { MovieCard, MovieCardProps } from './MovieCard';
import { Loader2 } from 'lucide-react';

interface MovieGridProps {
  movies: MovieCardProps[];
  isLoading: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Aucun film trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {movies.map((movie) => (
        <div 
          key={movie.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${(movies.indexOf(movie) % 4) * 100}ms` }}
        >
          <MovieCard {...movie} />
        </div>
      ))}
    </div>
  );
};
