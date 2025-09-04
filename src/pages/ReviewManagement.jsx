import { useEffect, useState } from 'react';
import { FaEye, FaSearch, FaStar, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../utils/auth';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await adminAPI.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete this review for "${bookTitle}"?`)) {
      try {
        await adminAPI.deleteReview(reviewId);
        toast.success('Review deleted successfully');
        fetchReviews(); // Refresh the list
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const closeModal = () => {
    setShowReviewModal(false);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReviewStats = () => {
    const stats = {
      total: reviews.length,
      byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      averageRating: 0
    };

    reviews.forEach(review => {
      stats.byRating[review.rating]++;
    });

    stats.averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return stats;
  };

  const stats = getReviewStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="mt-2 text-gray-600">Moderate and manage customer reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
          </div>
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-sm font-medium text-gray-600 mr-1">{rating}</span>
                <FaStar className="text-yellow-400 text-xs" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.byRating[rating]}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by book title, user name, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book & User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {review.bookTitle}
                        </div>
                        <div className="flex items-center">
                          <img
                            src={review.userImage || `https://ui-avatars.com/api/?name=${review.userName}&background=6366f1&color=fff`}
                            alt={review.userName}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <div className="text-sm text-gray-600">{review.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {review.title && (
                          <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                            {review.title}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {review.comment}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReview(review)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id, review.bookTitle)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Details Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Review Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Book Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Book Information</h4>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <img
                      src={selectedReview.bookCoverImage || 'https://placehold.co/60x80?text=No+Image'}
                      alt={selectedReview.bookTitle}
                      className="w-12 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{selectedReview.bookTitle}</h5>
                      <p className="text-sm text-gray-600">by {selectedReview.bookAuthor}</p>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Reviewer Information</h4>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <img
                      src={selectedReview.userImage || `https://ui-avatars.com/api/?name=${selectedReview.userName}&background=6366f1&color=fff`}
                      alt={selectedReview.userName}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{selectedReview.userName}</h5>
                      <p className="text-sm text-gray-600">User ID: {selectedReview.userId}</p>
                      <p className="text-sm text-gray-600">Review Date: {formatDate(selectedReview.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Review Content</h4>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {renderStars(selectedReview.rating)}
                      </div>
                      <span className="text-lg font-medium text-gray-900">
                        {selectedReview.rating}/5
                      </span>
                    </div>

                    {/* Title */}
                    {selectedReview.title && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Title:</h5>
                        <p className="text-gray-900">{selectedReview.title}</p>
                      </div>
                    )}

                    {/* Comment */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Review:</h5>
                      <p className="text-gray-900 leading-relaxed">{selectedReview.comment}</p>
                    </div>

                    {/* Verification Status */}
                    <div className="mt-4 flex items-center gap-2">
                      {selectedReview.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified Purchase
                        </span>
                      )}
                      {selectedReview.helpful && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Helpful
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => handleDeleteReview(selectedReview._id, selectedReview.bookTitle)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50"
                >
                  Delete Review
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;