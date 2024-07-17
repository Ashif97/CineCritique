import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseurl } from '../baseurl/baseurl';

const Reviews = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(1);
  const [editingReviewId, setEditingReviewId] = useState(null); // To track which review is being edited
  const user = useSelector((state) => state.user);
  const [reviewedMessage, setReviewedMessage] = useState('');

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/reviews/${movieId}`);
      const { reviews } = response.data;
      setReviews(reviews);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) {
      setReviewedMessage('Please add your review before submitting.');
      setTimeout(() => {
        setReviewedMessage('');
      }, 3000);
      return;
    }

    if (!user.id) {
      setError('User ID not found');
      return;
    }

    try {
      await axios.post(`${baseurl}/api/reviews`, {
        userId: user.id,
        movieId,
        rating,
        reviewText: newReview,
      });

      setNewReview('');
      setRating(1);
      fetchReviews(); // Refetch reviews
      setReviewedMessage('Review submitted successfully.');
      setTimeout(() => {
        setReviewedMessage('');
      }, 3000); // Clear message after 3 seconds
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setReviewedMessage('You have already reviewed this movie. You can edit your review, or delete it and submit a fresh one.');
        setTimeout(() => {
          setReviewedMessage('');
        }, 6000); // Clear message after 6 seconds
      } else {
        setError(err.response?.data?.message || 'An error occurred while submitting the review');
      }
    }
  };

  const handleReviewEdit = async () => {
    try {
      await axios.put(`${baseurl}/api/reviews/${editingReviewId}`, {
        rating,
        reviewText: newReview,
      });

      setNewReview('');
      setRating(1);
      setEditingReviewId(null); // Clear the editing state
      fetchReviews(); // Refetch reviews
      setReviewedMessage('Review updated successfully.');
      setTimeout(() => {
        setReviewedMessage('');
      }, 3000); // Clear message after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while editing the review');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await axios.delete(`${baseurl}/api/reviews/${reviewId}`);

      fetchReviews(); // Refetch reviews
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the review');
    }
  };

  const startEditingReview = (review) => {
    setEditingReviewId(review._id);
    setNewReview(review.reviewText);
    setRating(review.rating);
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-6">Reviews</h2>
      {reviews.map((review) => (
        <div key={review._id} className="flex space-x-4 items-center">
          <div>
            {review.user && (
              <>
                <p className="font-semibold">
                  {review.user.username} {review.user._id === user.id && "(You)"}
                </p>
                <p className="text-gray-500">Review: "{review.reviewText}"</p>
                <p className="text-yellow-400">Rating: {review.rating}/10</p>
                {review.user._id === user.id && (
                  <div className="space-x-2">
                    <button
                      onClick={() => startEditingReview(review)}
                      className="bg-blue-500 text-white rounded p-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleReviewDelete(review._id)}
                      className="bg-red-500 text-white rounded p-2"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4">
        {reviewedMessage && (
          <div className="text-green-500 mb-2">
            {reviewedMessage}
          </div>
        )}
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Add your review"
          className="w-full border rounded p-2"
        />
        <div className="flex items-center mt-2">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded p-2"
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>{num + 1}</option>
            ))}
          </select>
          {editingReviewId ? (
            <button onClick={handleReviewEdit} className="ml-2 bg-green-500 text-white rounded p-2">
              Update
            </button>
          ) : (
            <button onClick={handleReviewSubmit} className="ml-2 bg-blue-500 text-white rounded p-2">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
