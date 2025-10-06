import { Link } from "react-router-dom";
import movieApi from "../services/movieApi";
import SeparatedMovieCard from "./SeparatedMovieCard";

const TopMoviesSection = ({ movies = [] }) => {
  const formatYear = (year) => {
    if (!year) return '';
    if (typeof year === 'number') return year;
    if (typeof year === 'string') {
      const parsed = parseInt(year);
      return isNaN(parsed) ? '' : parsed;
    }
    return '';
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
    <div className="bg-gray-900 py-8">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-6">Top 6 Phim Nổi Bật</h2>
        
        {movies && movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {movies.slice(0, 6).map((movie, index) => (
              <div key={movie.slug || movie._id} className="relative">
                {/* Number badge */}
                <div className="absolute -top-2 -left-2 z-20">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-2xl border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                
                <SeparatedMovieCard 
                  movie={movie}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="animate-float">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">Không có phim nổi bật</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMoviesSection;
