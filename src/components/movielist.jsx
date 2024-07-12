import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../baseurl/baseurl';

const MovieList = ({ isAdmin }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRatingCategory, setSelectedRatingCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const disableLinks = location.pathname === '/admin'; // Replace '/some-page' with the actual path

  const ratingCategories = [
    { label: 'All Ratings', value: '' },
    { label: 'High Rated', value: '8-10' },
    { label: 'Average Rated', value: '5-7.9' },
    { label: 'Low Rated', value: '1-4.9' },
    // { label: 'Unrated', value: '0' } // Adjusted 'Unrated' value to '0' to match backend logic
  ];

  useEffect(() => {
    axios.get(`${baseurl}/api/movies`)
      .then(response => {
        const uniqueGenres = [...new Set(response.data.flatMap(movie => movie.genres))];
        setGenres(uniqueGenres);
      })
      .catch(error => console.error('Error fetching genres:', error));
  }, []);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchQuery) params.append('query', searchQuery);
    if (selectedGenre) params.append('genres', selectedGenre);
    if (selectedRatingCategory) {
      params.append('averagerating', selectedRatingCategory);
    }

    try {
      const response = await axios.get(`${baseurl}/api/movies/search?${params.toString()}`);
      const moviesData = response.data;

      const moviesWithRatings = await Promise.all(
        moviesData.map(async movie => {
          const ratingResponse = await axios.get(`${baseurl}/api/reviews/${movie._id}`);
          return { ...movie, averageRating: ratingResponse.data.averageRating };
        })
      );

      // Filter movies based on selectedRatingCategory
      let filteredMovies = moviesWithRatings;
      if (selectedRatingCategory) {
        if (selectedRatingCategory === '0') {
          // Handle unrated movies
          filteredMovies = moviesWithRatings.filter(movie => movie.averageRating === undefined);
        } else {
          const [min, max] = selectedRatingCategory.split('-').map(Number);
          filteredMovies = moviesWithRatings.filter(movie => {
            if (movie.averageRating) {
              return movie.averageRating >= min && movie.averageRating <= max;
            }
            return false;
          });
        }
      }

      setMovies(filteredMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre, selectedRatingCategory]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleGenreChange = event => {
    setSelectedGenre(event.target.value);
  };

  const handleRatingCategoryChange = event => {
    setSelectedRatingCategory(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedRatingCategory, searchQuery, fetchMovies]);

  const handleDelete = useCallback(async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      setIsDeleting(true);
      try {
        await axios.delete(`${baseurl}/api/movies/${movieId}`);
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError('Failed to delete movie. Please try again.');
        }
      } finally {
        setIsDeleting(false);
      }
    }
  }, [fetchMovies]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Movie List</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="border rounded p-2 w-full"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select
          value={selectedRatingCategory}
          onChange={handleRatingCategoryChange}
          className="border rounded p-2 w-full"
        >
          {ratingCategories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {movies.length === 0 ? (
        <p className="text-center text-gray-500">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {movies.map(movie => (
            <div key={movie._id} className="border rounded-lg shadow-md overflow-hidden">
              {disableLinks ? (
                <div>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                    <p className="text-gray-700 mb-4 line-clamp-3">{movie.description}</p>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold">Release:</span> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Genre:</span> {movie.genres.join(', ')}</p>
                      <p><span className="font-semibold">Cast:</span> {movie.topCast.join(', ')}</p>
                      <p>
                        <span className="font-semibold">Rating:</span> {movie.averageRating !== undefined ? movie.averageRating : 'Unrated'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to={`/movie/${movie._id}`}>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                    <p className="text-gray-700 mb-4 line-clamp-3">{movie.description}</p>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold">Release:</span> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Genre:</span> {movie.genres.join(', ')}</p>
                      <p><span className="font-semibold">Cast:</span> {movie.topCast.join(', ')}</p>
                      <p>
                        <span className="font-semibold">Rating:</span> {movie.averageRating !== undefined ? movie.averageRating : 'Unrated'}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(movie._id)}
                  disabled={isDeleting}
                  className={`mt-4 w-full ${isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white font-bold py-2 px-4 rounded transition duration-300`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Movie'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
