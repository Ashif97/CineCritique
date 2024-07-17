import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from './Navbar.jsx';
import { baseurl } from '../baseurl/baseurl';
import 'daisyui/dist/full.css';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get(`${baseurl}/api/admin/users`);
        setUsers(usersResponse.data);

        // Fetch movies
        const moviesResponse = await axios.get(`${baseurl}/api/movies`);
        setMovies(moviesResponse.data);

        // Fetch reviews for each movie
        const reviewsPromises = moviesResponse.data.map(movie =>
          axios.get(`${baseurl}/api/reviews/${movie._id}`).catch(err => null) // Handle individual fetch errors
        );
        const reviewsResponses = await Promise.all(reviewsPromises);

        // Filter out any null responses (failed requests)
        const validReviewsResponses = reviewsResponses.filter(res => res !== null);

        // Extract review data
        setReviews(validReviewsResponses.map(res => res.data));

      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      }
    };

    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalMovies = movies.length;

  const recentUsers = users.slice(-5).reverse().map(user => (
    <li key={user._id}>{user.username}</li>
  ));

  const recentMovies = movies.slice(0,5).map(movie => (
    <li key={movie._id}>{movie.title}</li>
  ));
  const chartData = {
    labels: movies.map(movie => movie.title),
    datasets: [
      {
        label: 'Number of Reviews',
        data: reviews.map(review => review.reviews.length),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true, // Start y-axis at 0
        ticks: {
          stepSize: 1, // Display integer values only
          precision: 0, // Disable fractional ticks
        },
      },
    },
  };

  return (
    <div>
      <div className="container mx-auto p-4">
  <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
  {error && <p className="text-red-500">{error}</p>}
  <div className="flex flex-wrap md:flex-nowrap">
    <div className="w-full md:w-2/3">
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-blue-100 p-2 rounded-md text-gray-900">Total Users: {totalUsers}</h2>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-blue-100 p-2 rounded-md text-gray-900">Total Movies: {totalMovies}</h2>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-blue-100 p-2 rounded-md text-gray-900">Recently Joined Users:</h2>
        <ul className="list-disc list-inside text-lg font-semibold">{recentUsers}</ul>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-blue-100 p-2 rounded-md text-gray-900">Recently Added Movies:</h2>
        <ul className="list-disc list-inside text-lg font-semibold">{recentMovies}</ul>
      </div>
    </div>
    <div className="w-full md:w-1/3 md:ml-4">
      <h2 className="text-2xl font-bold bg-blue-100 p-2 rounded-md mb-4 text-gray-900">Number of Reviews per Movie:</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div style={{ width: '100%', height: '300px' }}>
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  </div>
</div>
 


      </div>
   
  );
};

export default AdminDashboard;