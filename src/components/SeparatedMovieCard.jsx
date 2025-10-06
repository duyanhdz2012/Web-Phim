import { Link } from "react-router-dom";
import movieApi from "../services/movieApi";
import MovieTooltip from "./MovieTooltip";

const SeparatedMovieCard = ({ movie, index = 0 }) => {
  const formatYear = (year) => {
    if (!year) return '';
    if (typeof year === 'number') return year;
    if (typeof year === 'string') {
      const parsed = parseInt(year);
      return isNaN(parsed) ? '' : parsed;
    }
    return '';
  };

  const getQualityBadge = (quality) => {
    if (!quality) return null;
    
    const qualityColors = {
      'HD': 'bg-green-500',
      'FHD': 'bg-blue-500',
      '4K': 'bg-purple-500',
      'CAM': 'bg-red-500',
      'TS': 'bg-orange-500',
      'TC': 'bg-yellow-500'
    };
    
    const color = qualityColors[quality] || 'bg-gray-500';
    
    return (
      <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${color} shadow-lg`}>
        {quality}
      </span>
    );
  };

  const getRatingBadge = (rating) => {
    if (!rating) return null;
    
    const ratingColors = {
      'T18': 'bg-red-600',
      'T16': 'bg-orange-500',
      'T13': 'bg-yellow-500',
      'T6': 'bg-green-500',
      'P': 'bg-blue-500'
    };
    
    const color = ratingColors[rating] || 'bg-gray-500';
    
    return (
      <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${color} shadow-lg`}>
        {rating}
      </span>
    );
  };

  const handleMovieClick = () => {
    console.log('Movie clicked:', movie.name, 'Slug:', movie.slug, 'ID:', movie._id);
  };

  return (
    <MovieTooltip movie={movie}>
      <div className="group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
        <Link 
          to={`/phim/${movie.slug || movie._id}`} 
          className="block"
          onClick={handleMovieClick}
        >
        {/* Poster Section */}
        <div className="relative overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
          <div className="relative aspect-[3/4] overflow-hidden">
            {/* Background image */}
            <img
              src={movieApi.getWebpImage(movie.poster_url || movie.thumb_url)}
              alt={movie.name}
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/src/assets/temp-1.jpeg';
              }}
            />
            
            {/* Enhanced gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
            
            {/* Animated border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-xl transition-all duration-500"></div>
            
            {/* Quality badge */}
            {movie.quality && (
              <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                  {getQualityBadge(movie.quality)}
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            )}
            
            {/* Episode info */}
            {movie.episode_current && movie.episode_total && (
              <div className="absolute bottom-3 left-3 z-10">
                <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 shadow-lg">
                  Tập {movie.episode_current}/{movie.episode_total}
                </div>
              </div>
            )}
            
            {/* Rating badge */}
            {movie.rating && (
              <div className="absolute top-3 left-3 z-10">
                {getRatingBadge(movie.rating)}
              </div>
            )}
            
            {/* Enhanced play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="relative">
                <div className="bg-red-600/90 backdrop-blur-sm rounded-full p-4 hover:bg-red-700/90 transition-all duration-300 animate-pulse-glow shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            {/* Movie info overlay - slides up on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                {movie.name}
              </h3>
              
              {/* English Title in overlay */}
              {(movie.origin_name || movie.name_en) && (
                <h4 className="text-gray-300 text-xs italic line-clamp-1 mb-2 group-hover:text-gray-200 transition-colors duration-300">
                  {movie.origin_name || movie.name_en}
                </h4>
              )}
              
              {/* Enhanced movie details */}
              <div className="space-y-1 text-xs text-gray-300">
                {/* Chỉ hiển thị tên phim trong overlay */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Movie Title Section - Tách riêng */}
        <div className="mt-3 space-y-2">
          {/* Movie Title */}
          <h3 className="text-white font-bold text-base line-clamp-2 group-hover:text-red-400 transition-colors duration-300 leading-tight">
            {movie.name}
          </h3>
          
          {/* English Title */}
          {(movie.origin_name || movie.name_en) && (
            <h4 className="text-gray-400 text-sm italic line-clamp-1 group-hover:text-gray-300 transition-colors duration-300">
              {movie.origin_name || movie.name_en}
            </h4>
          )}
          
          {/* Episode Status */}
          {movie.episode_current && movie.episode_total && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Trạng thái:</span>
              <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded-full border border-red-600/30">
                Tập {movie.episode_current}/{movie.episode_total}
              </span>
            </div>
          )}
        </div>
        </Link>
      </div>
    </MovieTooltip>
  );
};

export default SeparatedMovieCard;
