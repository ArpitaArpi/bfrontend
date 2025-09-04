import { FaStar, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useIsAdmin } from '../../utils/auth';

const Review = ({ review, onDeleteReview, darkMode }) => {
  const { isAdmin } = useIsAdmin();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/admin/reviews/${review._id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          toast.success('Review deleted successfully');
          if (onDeleteReview) {
            onDeleteReview(review._id);
          }
        } else {
          throw new Error('Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
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

  return (
    <div className={`rounded-lg shadow-sm border p-6 mb-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* User Info and Rating */}
          <div className="flex items-center mb-2">
            <img
              src={review.userImage || `https://ui-avatars.com/api/?name=${review.userName}&background=6366f1&color=fff`}
              alt={review.userName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{review.userName}</h4>
                <span className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{formatDate(review.createdAt)}</span>
              </div>
              <div className="flex items-center mt-1">
                {renderStars(review.rating)}
                <span className={`ml-2 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>({review.rating}/5)</span>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="mt-3">
            {review.title && (
              <h5 className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{review.title}</h5>
            )}
            <p className={`text-sm leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>{review.comment}</p>
          </div>

          {/* Helpful/Verified Badges */}
          <div className="flex items-center gap-2 mt-3">
            {review.verified && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                darkMode 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-green-100 text-green-800'
              }`}>
                ✓ Verified Purchase
              </span>
            )}
            {review.helpful && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                darkMode 
                  ? 'bg-blue-900 text-blue-300' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                Helpful
              </span>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && onDeleteReview && (
          <button
            onClick={handleDelete}
            className={`ml-4 p-2 rounded-full transition-colors ${
              darkMode 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
            }`}
            title="Delete Review"
          >
            <FaTrash className="text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Review;