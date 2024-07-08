import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

function Carousel() {
  const [images, setImages] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const moviesResponse = await axios.get('http://localhost:5000/api/movies');
        setMovies(moviesResponse.data.slice(0, 5));
        setImages(moviesResponse.data.map(movie => movie.image).slice(0, 5));
        if (moviesResponse.data.length > 0) {
          setSelectedMovie(moviesResponse.data[0]._id); // Select the first movie by default
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <br />
      <h2 className="text-3xl font-bold text-white-opacity-75 p-2">Welcome to CineCritique.</h2>
      <h1 className="text-lg font-bold text-white-opacity-75 p-2">Explore the Top movies, feel free to rate and leave your review!</h1>
      <br/>
      <h3 className="text font-bold text-white-opacity-75 p-2">Recently added movies:</h3>

      <div className="flex flex-col">
        <div className="flex">
          <div className="w-full p-2 relative">
            <div className="carousel w-full relative rounded-lg overflow-hidden h-96">
              {images.map((image, index) => (
                <div key={index} className={`carousel-item relative w-full ${index === 0 ? 'active' : ''}`}>
                  <Link to={`/movie/${movies[index]._id}`} className="w-full h-full block">
                    <img src={image} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-white bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-300">
                      <h2 className="text-3xl font-bold">{movies.length > 0 ? movies[index].title : 'Loading...'}</h2>
                    </div>
                  </Link>
                  <div className="absolute flex justify-between items-center transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <a href={`#slide${index === 0 ? images.length : index}`} className="btn btn-circle">❮</a>
                    <a href={`#slide${index === images.length - 1 ? 1 : index + 2}`} className="btn btn-circle">❯</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
