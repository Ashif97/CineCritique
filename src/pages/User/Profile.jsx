import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useSelector } from 'react-redux';
import { baseurl } from '../../baseurl/baseurl';

export default function Profile() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // State for success message
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/reviews/by-user/${user.id}`);
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching your reviews');
      }
    };

    fetchUserReviews();
  }, [user.id]);

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${baseurl}/api/users/${user.id}`);
      setDeleteError(null); // Clear any previous delete errors
      setDeleteSuccess(true); // Show success message
      setTimeout(() => {
        navigate('/'); // Redirect to home page after 4 seconds
      }, 4000);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'An error occurred while deleting your account');
    }
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Reviews</h1>
        <div className="overflow-y-auto max-h-80vh mb-8">
          {reviews.length === 0 ? (
            <p className="text-center">You have not reviewed any movies yet.</p>
          ) : (
            reviews.map((review) => (
              <Link key={review._id} to={`/movie/${review.movie._id}`} className="block p-4 border rounded shadow-md mb-4">
                <h2 className="text-xl font-semibold">{review.movie.title}</h2>
                <p className="text-gray-600">Review: {review.reviewText}</p>
                <p className="text-yellow-400">Rating: {review.rating}/10</p>
                <p className="text-gray-500">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Fixed delete button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500 text-white rounded p-2"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-4">Are you sure you want to delete your account?</p>
            {deleteError && (
              <div className="text-red-500 mb-4">{deleteError}</div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white rounded p-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white rounded p-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {deleteSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Account Deleted Successfully</h2>
          </div>
        </div>
      )}
    </div>
  );
}
