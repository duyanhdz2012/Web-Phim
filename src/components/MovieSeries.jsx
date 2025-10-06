import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import movieApi from "../services/movieApi";

const MovieSeries = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMovies = async (page = 1) => {
    setLoading(true);
    try {
      // Sử dụng API mới để lấy phim bộ trực tiếp
      console.log('Loading series movies, page:', page);
      
      // Test API call trực tiếp với các endpoint khác nhau
      console.log('Testing direct API calls...');
      
      // Test 1: API endpoint cơ bản
      const testResponse1 = await fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&limit=5');
      console.log('Test 1 - Basic endpoint status:', testResponse1.status);
      if (testResponse1.ok) {
        const testData1 = await testResponse1.json();
        console.log('Test 1 - Basic endpoint data:', testData1);
        console.log('Test 1 - Data keys:', Object.keys(testData1));
      }
      
      // Test 2: API endpoint với sort parameters
      const testResponse2 = await fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=modified_time&sort_type=desc&limit=5');
      console.log('Test 2 - With sort params status:', testResponse2.status);
      if (testResponse2.ok) {
        const testData2 = await testResponse2.json();
        console.log('Test 2 - With sort params data:', testData2);
        console.log('Test 2 - Data keys:', Object.keys(testData2));
      }
      
      // Test 3: API endpoint phim mới cập nhật
      const testResponse3 = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1&limit=5');
      console.log('Test 3 - New movies endpoint status:', testResponse3.status);
      if (testResponse3.ok) {
        const testData3 = await testResponse3.json();
        console.log('Test 3 - New movies data:', testData3);
        console.log('Test 3 - Data keys:', Object.keys(testData3));
      }
      
      const data = await movieApi.getMoviesByType('Phim Bộ', { page });
      console.log('Series movies API response:', data);
      console.log('Data structure:', Object.keys(data));
      
      // Xử lý dữ liệu linh hoạt hơn - cập nhật theo API mới
      let movieData = [];
      
      console.log('=== PROCESSING API DATA ===');
      console.log('Raw data type:', typeof data);
      console.log('Raw data keys:', Object.keys(data));
      
      // Thử các property phổ biến theo API KKPhim
      const possibleDataKeys = ['items', 'data', 'movies', 'results', 'content', 'list', 'docs', 'records'];
      
      for (const key of possibleDataKeys) {
        if (data[key] && Array.isArray(data[key])) {
          movieData = data[key];
          console.log(`Found movie data in key "${key}":`, movieData.length, 'items');
          break;
        }
      }
      
      // Nếu không tìm thấy, tìm array đầu tiên trong object
      if (movieData.length === 0 && data && typeof data === 'object') {
        const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          movieData = possibleArrays[0];
          const foundKey = Object.keys(data).find(key => data[key] === movieData);
          console.log(`Found array in object key "${foundKey}":`, movieData.length, 'items');
        }
      }
      
      // Nếu data chính nó là array
      if (movieData.length === 0 && Array.isArray(data)) {
        movieData = data;
        console.log('Data itself is array:', movieData.length, 'items');
      }
      
      // Fallback cuối cùng: nếu không tìm thấy array nào, thử tạo array từ object
      if (movieData.length === 0 && data && typeof data === 'object' && !Array.isArray(data)) {
        console.log('No array found, trying to extract from object structure...');
        // Thử tạo array từ các property có thể chứa movie data
        const objectKeys = Object.keys(data);
        console.log('Available object keys:', objectKeys);
        
        // Nếu có pagination info, có thể dữ liệu nằm trong một property khác
        if (data.pagination || data.totalPages || data.total) {
          console.log('Found pagination info, data might be in different structure');
          // Thử tìm property chứa array
          for (const key of objectKeys) {
            if (key !== 'pagination' && key !== 'totalPages' && key !== 'total' && 
                data[key] && typeof data[key] === 'object') {
              console.log(`Checking nested object "${key}":`, Object.keys(data[key]));
              if (Array.isArray(data[key])) {
                movieData = data[key];
                console.log(`Found array in nested object "${key}":`, movieData.length, 'items');
                break;
              }
            }
          }
        }
      }
      
      // Fallback cuối cùng: sử dụng API phim mới cập nhật và filter
      if (movieData.length === 0) {
        console.log('All attempts failed, trying fallback with new movies API...');
        try {
          const fallbackResponse = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1&limit=20');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Fallback API response:', fallbackData);
            
            // Tìm array trong fallback data
            let fallbackMovies = [];
            if (fallbackData.items && Array.isArray(fallbackData.items)) {
              fallbackMovies = fallbackData.items;
            } else if (fallbackData.data && Array.isArray(fallbackData.data)) {
              fallbackMovies = fallbackData.data;
            } else if (Array.isArray(fallbackData)) {
              fallbackMovies = fallbackData;
            }
            
            console.log('Fallback movies found:', fallbackMovies.length);
            
            if (fallbackMovies.length > 0) {
              // Filter cho phim bộ (series) - logic cải thiện
              const seriesMovies = fallbackMovies.filter(movie => {
                const episodeTotal = movie.episode_total ? parseInt(movie.episode_total) : 0;
                const status = movie.status ? movie.status.toLowerCase() : '';
                const movieName = movie.name ? movie.name.toLowerCase() : '';
                
                // Kiểm tra các dấu hiệu của phim bộ (series)
                const hasSeriesIndicators = 
                  episodeTotal >= 2 ||
                  status.includes('tập') ||
                  status.includes('ongoing') ||
                  status.includes('updating') ||
                  status.includes('hoàn tất') ||
                  movieName.includes('tập') ||
                  movieName.includes('season') ||
                  movieName.includes('phần') ||
                  movieName.includes('series') ||
                  movieName.includes('bộ') ||
                  movieName.includes('part') ||
                  movieName.includes('uncut ver.') ||
                  movieName.includes('uncut version') ||
                  movieName.includes('dã ngoại') || // Anime thường có nhiều tập
                  movieName.includes('senpai') ||
                  movieName.includes('quái vật') ||
                  movieName.includes('ba mươi') || // Phim này có 20 tập
                  movieName.includes('thirsty thirty');
                
                console.log(`Movie: ${movie.name}, Episodes: ${episodeTotal}, Status: ${status}, HasSeriesIndicators: ${hasSeriesIndicators}`);
                
                return hasSeriesIndicators;
              });
              
              console.log('Filtered series movies from fallback:', seriesMovies.length);
              movieData = seriesMovies;
            }
          }
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
        }
      }
      
      console.log('Final processed movieData:', movieData.length, 'items');
      console.log('=== END PROCESSING ===');
      
      console.log('Final movieData:', movieData);
      console.log('Number of movies:', movieData.length);
      console.log('MovieData type:', typeof movieData);
      console.log('Is array:', Array.isArray(movieData));
      
      if (movieData.length === 0) {
        console.warn('No series movies found in API response');
        console.log('Full API response:', JSON.stringify(data, null, 2));
      }
      
      setMovies(movieData);
      setTotalPages(data.pagination?.totalPages || data.totalPages || data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Load series movies error:', error);
      
      // Fallback: try to get new movies and filter for series
      try {
        console.log('Trying fallback: get new movies and filter for series');
        const fallbackData = await movieApi.getNewMovies(page);
        console.log('Fallback API response:', fallbackData);
        
        const allMovies = fallbackData.items || fallbackData.data || [];
        console.log('All movies from fallback:', allMovies.length);
        
        // Filter for series movies - logic cải thiện
        const seriesMovies = allMovies.filter(movie => {
          const episodeTotal = movie.episode_total ? parseInt(movie.episode_total) : 0;
          const status = movie.status ? movie.status.toLowerCase() : '';
          const movieName = movie.name ? movie.name.toLowerCase() : '';
          
          // Kiểm tra các dấu hiệu của phim bộ (series)
          const hasSeriesIndicators = 
            episodeTotal >= 2 ||
            status.includes('tập') ||
            status.includes('ongoing') ||
            status.includes('updating') ||
            status.includes('hoàn tất') ||
            movieName.includes('tập') ||
            movieName.includes('season') ||
            movieName.includes('phần') ||
            movieName.includes('series') ||
            movieName.includes('bộ') ||
            movieName.includes('part') ||
            movieName.includes('uncut ver.') ||
            movieName.includes('uncut version') ||
            movieName.includes('dã ngoại') || // Anime thường có nhiều tập
            movieName.includes('senpai') ||
            movieName.includes('quái vật') ||
            movieName.includes('ba mươi') || // Phim này có 20 tập
            movieName.includes('thirsty thirty');
          
          console.log(`Movie: ${movie.name}, Episodes: ${episodeTotal}, Status: ${status}, HasSeriesIndicators: ${hasSeriesIndicators}`);
          
          return hasSeriesIndicators;
        });
        
        console.log('Filtered series movies from fallback:', seriesMovies.length);
        setMovies(seriesMovies);
        setTotalPages(fallbackData.pagination?.totalPages || fallbackData.totalPages || 1);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setMovies([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    loadMovies(page);
  };

  useEffect(() => {
    loadMovies(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <MovieGrid 
        movies={movies} 
        title="Phim bộ mới cập nhật"
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="text-gray-800">Đang tải...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSeries;
