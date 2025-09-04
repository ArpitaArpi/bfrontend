import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReviewForm = ({ bookId, onReviewAdded, existingReview, darkMode }) => {
  const { user } = useUser();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔧 Review Form Debug:');
    console.log('User:', user);
    console.log('BookId:', bookId);
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        bookId,
        rating,
        title: title.trim() || null,
        comment: comment.trim(),
        userId: user.id,
        userName: `${user.firstName || 'Anonymous'} ${user.lastName || 'User'}`,
        userImage: user.imageUrl || null
      };
      
      console.log('📤 Sending review data:', reviewData);

      const url = existingReview 
        ? `http://localhost:5001/api/reviews/${existingReview._id}`
        : 'http://localhost:5001/api/reviews';
      
      const method = existingReview ? 'PUT' : 'POST';
      
      console.log('🌐 API Request:', { url, method });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      console.log('📥 API Response status:', response.status);
      console.log('📥 API Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success result:', result);
        toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
        
        if (onReviewAdded) {
          onReviewAdded(result);
        }

        // Reset form if it's a new review
        if (!existingReview) {
          setRating(0);
          setTitle('');
          setComment('');
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Error response body:', errorText);
        
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || 'Failed to submit review';
        } catch {
          errorMessage = `Server error (${response.status}): ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Review submission error:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starRating = index + 1;
      return (
        <button
          key={index}
          type="button"
          className={`text-2xl transition-colors ${
            starRating <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } hover:text-yellow-400 focus:outline-none`}
          onClick={() => handleStarClick(starRating)}
          onMouseEnter={() => handleStarHover(starRating)}
          onMouseLeave={handleStarLeave}
        >
          <FaStar />
        </button>
      );
    });
  };

  const getRatingText = () => {
    const currentRating = hoverRating || rating;
    switch (currentRating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border p-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Rating *
          </label>
          <div className="flex items-center space-x-1 mb-2">
            {renderStars()}
          </div>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {getRatingText()} {rating > 0 && `(${rating}/5)`}
          </p>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your review in a few words"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            maxLength="100"
          />
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{title.length}/100 characters</p>
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience with this book..."
            rows="4"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            maxLength="1000"
            required
          />
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{comment.length}/1000 characters</p>
        </div>

        {/* User Info Display */}
        <div className={`flex items-center p-3 rounded-md transition-colors ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <img
            src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=fff`}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Reviewing as {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={submitting || !rating || !comment.trim()}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              submitting || !rating || !comment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {submitting 
              ? (existingReview ? 'Updating...' : 'Submitting...') 
              : (existingReview ? 'Update Review' : 'Submit Review')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;