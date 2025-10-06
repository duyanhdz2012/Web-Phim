import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import movieApi from "../services/movieApi";

const MovieDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState('episodes');

  useEffect(() => {
    const loadMovieDetail = async () => {
      try {
        setLoading(true);
        const data = await movieApi.getMovieDetail(slug);
        console.log('Movie Detail API Response:', data);
        
        if (data.movie) {
          console.log('Movie data:', data.movie);
          console.log('Movie actors:', data.movie.actor);
          console.log('Movie director:', data.movie.director);
          console.log('Movie cast:', data.movie.cast);
          console.log('Movie crew:', data.movie.crew);
          console.log('All movie keys:', Object.keys(data.movie));
          setMovie(data.movie);
        }
        
        if (data.episodes) {
          setEpisodes(data.episodes);
        }
        
        if (data.episodes && data.episodes.length > 0 && data.episodes[0].server_data && data.episodes[0].server_data.length > 0) {
          setSelectedEpisode(data.episodes[0].server_data[0]);
        }
      } catch (error) {
        console.error('Error loading movie detail:', error);
        setError('Không thể tải thông tin phim');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadMovieDetail();
    }
  }, [slug]);

  const handlePlayEpisode = (episode) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
  };

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
      'HD': 'bg-green-600',
      'FullHD': 'bg-blue-600',
      '4K': 'bg-purple-600',
      'SD': 'bg-gray-600'
    };
    
    const color = qualityColors[quality] || 'bg-gray-600';
    
    return (
      <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${color}`}>
        {quality}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lỗi: {error}</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Đang tải thông tin phim...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-4">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${movieApi.getWebpImage(movie.poster_url || movie.thumb_url)})`
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                {/* Poster */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    <img
                      src={movieApi.getWebpImage(movie.poster_url || movie.thumb_url)}
                      alt={movie.name}
                      className="w-full rounded-lg shadow-2xl"
                      onError={(e) => {
                        e.target.src = '/src/assets/temp-1.jpeg';
                      }}
                    />
                    {movie.quality && (
                      <div className="absolute top-4 right-4">
                        {getQualityBadge(movie.quality)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-3">
                  <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-2 leading-tight">
                    {movie.name?.toUpperCase()}
                  </h1>
                  
                  {movie.name_en && (
                    <h2 className="text-xl md:text-2xl text-white font-medium mb-4">
                      {movie.name_en}
                    </h2>
                  )}

                  {/* Movie Info Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {movie.rating && (
                      <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {movie.rating}
                      </span>
                    )}
                    
                    {movie.year && (
                      <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {formatYear(movie.year)}
                      </span>
                    )}
                    
                    {movie.episode_total && movie.episode_total > 1 && (
                      <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Phần {movie.episode_current || 1}
                      </span>
                    )}
                    
                    {movie.episode_current && (
                      <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Tập {movie.episode_current}
                      </span>
                    )}
                  </div>

                  {/* Categories */}
                  {movie.category && movie.category.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {movie.category.map((cat, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status */}
                  {movie.status && (
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-white text-sm">
                        {movie.status === 'Đang phát' ? `Đã hoàn thành: ${movie.episode_current || 0}/${movie.episode_total || 0} tập` : movie.status}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setShowPlayer(true)}
                      className="flex items-center space-x-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl group"
                    >
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <span className="text-base">Xem Ngay</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>

                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                      </button>

                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                      </button>

                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                      </button>

                      <div className="flex items-center space-x-1 text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm">0 Đánh giá</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('episodes')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'episodes' 
                    ? 'border-red-500 text-red-500' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Tập phim
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'gallery' 
                    ? 'border-red-500 text-red-500' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setActiveTab('cast')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'cast' 
                    ? 'border-red-500 text-red-500' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Diễn viên
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'suggestions' 
                    ? 'border-red-500 text-red-500' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Đề xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Episodes Tab */}
          {activeTab === 'episodes' && episodes && episodes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600">
                    <option>Phần 1</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <span>Rút gọn</span>
                </button>
              </div>
              
              {episodes.map((server, serverIndex) => (
                <div key={serverIndex} className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">{server.server_name}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {server.server_data.map((episode, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlayEpisode(episode)}
                        className={`p-4 rounded-lg text-center transition-colors ${
                          selectedEpisode === episode
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-semibold">Tập {index + 1}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Movie Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Synopsis */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Giới thiệu</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.content || movie.description || 'Không có mô tả cho bộ phim này.'}
                </p>
              </div>

              {/* Movie Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Thông tin chi tiết</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tình trạng */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Tình trạng:</span>
                    <span className="text-white">
                      {movie.status || (movie.episode_current && movie.episode_total ? 
                        `Tập ${movie.episode_current}` : 'N/A')}
                    </span>
                  </div>
                  
                  {/* Số tập */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Số tập:</span>
                    <span className="text-white">
                      {movie.episode_total || (movie.episode_current ? movie.episode_current : 'N/A')}
                    </span>
                  </div>
                  
                  {/* Thời lượng */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Thời lượng:</span>
                    <span className="text-white">{movie.time || 'N/A'}</span>
                  </div>
                  
                  {/* Năm phát hành */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Năm phát hành:</span>
                    <span className="text-white">{formatYear(movie.year) || 'N/A'}</span>
                  </div>
                  
                  {/* Chất lượng */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Chất lượng:</span>
                    <span className="text-white">{movie.quality || 'N/A'}</span>
                  </div>
                  
                  {/* Ngôn ngữ */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Ngôn ngữ:</span>
                    <span className="text-white">{movie.language || 'N/A'}</span>
                  </div>
                  
                  {/* Đạo diễn */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Đạo diễn:</span>
                    <span className="text-white">
                      {(() => {
                        // Debug: Log director data
                        console.log('Director data:', movie.director);
                        
                        if (!movie.director) return 'Đang cập nhật';
                        
                        // Handle different data structures
                        if (Array.isArray(movie.director)) {
                          if (movie.director.length === 0) return 'Đang cập nhật';
                          
                          // Check if directors have name property
                          if (movie.director[0] && typeof movie.director[0] === 'object' && movie.director[0].name) {
                            return movie.director.map(dir => dir.name).join(', ');
                          }
                          // Check if directors are strings
                          else if (typeof movie.director[0] === 'string') {
                            return movie.director.join(', ');
                          }
                        }
                        
                        // Handle string case
                        if (typeof movie.director === 'string') {
                          return movie.director;
                        }
                        
                        return 'Đang cập nhật';
                      })()}
                    </span>
                  </div>
                  
                  {/* Diễn viên */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Diễn viên:</span>
                    <span className="text-white">
                      {(() => {
                        // Debug: Log actor data
                        console.log('Actor data:', movie.actor);
                        console.log('Cast data:', movie.cast);
                        
                        // Try different possible fields for actors
                        const actorData = movie.actor || movie.cast || movie.actors;
                        
                        if (!actorData) return 'Đang cập nhật';
                        
                        // Handle different data structures
                        if (Array.isArray(actorData)) {
                          if (actorData.length === 0) return 'Đang cập nhật';
                          
                          // Check if actors have name property
                          if (actorData[0] && typeof actorData[0] === 'object' && actorData[0].name) {
                            return actorData.slice(0, 8).map(actor => actor.name).join(', ');
                          }
                          // Check if actors are strings
                          else if (typeof actorData[0] === 'string') {
                            return actorData.slice(0, 8).join(', ');
                          }
                        }
                        
                        // Handle string case
                        if (typeof actorData === 'string') {
                          return actorData;
                        }
                        
                        return 'Đang cập nhật';
                      })()}
                    </span>
                  </div>
                  
                  {/* Thể loại */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Thể loại:</span>
                    <span className="text-white">
                      {movie.category && movie.category.length > 0 ? 
                        movie.category.map(cat => cat.name).join(', ') : 
                        'N/A'}
                    </span>
                  </div>
                  
                  {/* Quốc gia */}
                  <div className="flex">
                    <span className="text-gray-400 w-32">Quốc gia:</span>
                    <span className="text-white">
                      {movie.country && movie.country.length > 0 ? 
                        movie.country.map(country => country.name).join(', ') : 
                        'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mb-8">
                <div className="flex space-x-4 mb-6">
                  <button className="text-white border-b-2 border-red-500 pb-2">Bình luận (0)</button>
                  <button className="text-gray-400 hover:text-white transition-colors">Đánh giá</button>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-gray-400 mb-4">Vui lòng đăng nhập để tham gia bình luận.</p>
                  
                  <div className="space-y-4">
                    <textarea
                      placeholder="Viết bình luận"
                      className="w-full bg-gray-700 text-white p-4 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                      rows="4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-gray-400">
                          <input type="checkbox" className="rounded" />
                          <span>Tiết lộ?</span>
                        </label>
                        <span className="text-gray-500 text-sm">0/1000</span>
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Gửi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Cast Section */}
              {activeTab === 'cast' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Diễn viên</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {movie.cast && movie.cast.length > 0 ? (
                      movie.cast.slice(0, 8).map((actor, index) => (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {actor.name ? actor.name.charAt(0) : '?'}
                            </span>
                          </div>
                          <p className="text-white text-sm">{actor.name || 'Unknown'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-400">
                        Không có thông tin diễn viên
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Top Movies */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Top phim tuần này</h3>
                <div className="space-y-4">
                  <div className="text-gray-400 text-center py-8">
                    Không có dữ liệu
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-white text-lg font-semibold">
                  {movie.name} - {selectedEpisode.name}
                </h3>
                <button
                  onClick={() => setShowPlayer(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                {selectedEpisode.link_m3u8 ? (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={selectedEpisode.link_embed || selectedEpisode.link_m3u8}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; picture-in-picture"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Không có video để phát</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;