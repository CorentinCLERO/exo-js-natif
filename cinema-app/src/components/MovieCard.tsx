
import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export interface MovieCardProps {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  overview,
  release_date,
  poster_path,
  vote_average,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // Handle 3D effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 10; // max 10 degrees
    const rotateX = ((centerY - y) / centerY) * 10; // max 10 degrees
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  // Reset rotation on mouse leave
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const releaseYear = new Date(release_date).getFullYear();
  const truncatedOverview = overview.length > 100 
    ? overview.substring(0, 100) + '...' 
    : overview;
  
  // Default poster if none provided
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <Link to={`/movies/${id}`}>
      <Card 
        ref={cardRef}
        className="movie-card h-full overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease'
        }}
      >
        <div className="relative h-full">
          <img 
            src={posterUrl}
            alt={`${title} poster`}
            className="movie-card-poster"
            loading="lazy"
          />
          
          <div className="movie-card-overlay">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className="bg-black/50 text-white border-white/20"
              >
                {releaseYear}
              </Badge>
              
              <div className="flex items-center text-cinema-gold">
                <Star className="h-4 w-4 fill-cinema-gold stroke-cinema-gold mr-1" />
                <span>{vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-sm text-white/80 line-clamp-2">{truncatedOverview}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
