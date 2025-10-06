const SkeletonLoader = ({ count = 8, className = "" }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-fade-in">
          <div className="bg-gray-800 rounded-lg overflow-hidden hover-lift">
            {/* Poster skeleton */}
            <div className="skeleton aspect-[3/4] w-full"></div>
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title skeleton */}
              <div className="skeleton h-4 w-3/4 rounded"></div>
              
              {/* Year skeleton */}
              <div className="skeleton h-3 w-1/4 rounded"></div>
              
              {/* Rating skeleton */}
              <div className="flex items-center space-x-2">
                <div className="skeleton h-3 w-16 rounded"></div>
                <div className="skeleton h-3 w-8 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
