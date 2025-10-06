import { Link } from "react-router-dom";
import movieApi from "../services/movieApi";

const EnhancedMovieCard = ({ movie, index = 0 }) => {
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

  return (
    <Link
      to={`/phim/${movie.slug || movie._id}`}
      className="group block animate-fade-in relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
        {/* Main poster container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Background image with enhanced effects */}
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
          
          {/* Quality badge with enhanced styling */}
          {movie.quality && (
            <div className="absolute top-3 right-3 z-10">
              <div className="relative">
                {getQualityBadge(movie.quality)}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          )}
          
          {/* Episode info with enhanced styling */}
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
            <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
              {movie.name}
            </h3>
            
            {/* Enhanced movie details */}
            <div className="space-y-1 text-xs text-gray-300">
              {movie.year && (
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{formatYear(movie.year)}</span>
                </div>
              )}
              
              {movie.category && movie.category.length > 0 && (
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="line-clamp-1 text-gray-300">{movie.category.map(c => c.name).join(', ')}</span>
                </div>
              )}
              
              {movie.tmdb?.vote_average && (
                <div className="flex items-center space-x-2">
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-yellow-400 font-semibold">{movie.tmdb.vote_average}/10</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced card info section */}
        <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
            {movie.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">{formatYear(movie.year)}</span>
            {movie.tmdb?.vote_average && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-400 font-semibold">{movie.tmdb.vote_average}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedMovieCard;
