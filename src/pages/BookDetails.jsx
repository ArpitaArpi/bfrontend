import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaStar, FaUser } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Review from "../components/Review/Review";
import ReviewForm from "../components/ReviewForm/ReviewForm";
import { addToCart } from '../store/cartSlice';

const BookDetails = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const existingReview = reviews.find(review => review.userId === user.id);
      setUserReview(existingReview);
    }
  }, [user, reviews]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/book/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const data = await response.json();
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews. Please try again later.');
      // Set empty state on error
      setReviews([]);
      setAverageRating(0);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    // Refresh reviews to get updated data
    fetchReviews();
    setShowReviewForm(false);
    
    // Show success message
    if (newReview) {
      toast.success('Review added successfully!');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    // Optimistically update UI
    const originalReviews = [...reviews];
    setReviews(reviews.filter(review => review._id !== reviewId));
    
    try {
      // Refresh to get updated average rating and ensure consistency
      await fetchReviews();
    } catch (error) {
      // Revert on error
      setReviews(originalReviews);
      console.error('Error updating reviews:', error);
      toast.error('Failed to update reviews. Please refresh the page.');
    }
  };

  const handleAddToCart = () => {
    if (book) {
      dispatch(addToCart({ book, quantity: 1 }));
    }
  };

  const renderStars = (rating, size = 'text-sm') => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${size} ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-xl transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-xl transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-4 text-red-500">Book not found</h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`min-h-screen py-20 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Book Details */}
        <div className={`rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* Book Image */}
          <img
            src={book.coverImageUrl || "https://placehold.co/220x300?text=No+Image"}
            alt={book.title}
            className="h-80 md:h-96 w-auto rounded-lg shadow-md"
          />

          {/* Book Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
              <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>by {book.author}</p>
              
              {/* Rating Display */}
              {averageRating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-2">
                    {renderStars(averageRating, 'text-lg')}
                  </div>
                  <span className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {averageRating.toFixed(1)}
                  </span>
                  <span className={`ml-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
              
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{book.description || "No description available."}</p>
              {book.category && (
                <span className="inline-block bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {book.category}
                </span>
              )}
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-4 flex flex-col gap-4">
              <span className={`text-2xl font-bold ${
                darkMode ? 'text-indigo-400' : 'text-indigo-700'
              }`}>
                {book.price ? `$${book.price}` : "Contact for price"}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-500 text-black py-3 rounded-xl text-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                
                <button
                  onClick={() => navigate(`/order/${book._id}`)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-600 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Customer Reviews</h2>
            <SignedIn>
              {!userReview && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Write a Review
                </button>
              )}
            </SignedIn>
          </div>

          {/* Review Statistics */}
          {reviews.length > 0 && (
            <div className={`rounded-lg p-6 mb-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className={`text-4xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    {renderStars(averageRating, 'text-xl')}
                  </div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Rating Distribution */}
                <div className="flex-1 md:ml-8">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(review => review.rating === rating).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center mb-1">
                        <span className={`text-sm w-8 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>{rating}</span>
                        <FaStar className="text-yellow-400 text-xs mr-2" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm w-8 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <SignedIn>
            {showReviewForm && !userReview && (
              <div className="mb-8">
                <ReviewForm
                  bookId={id}
                  onReviewAdded={handleReviewAdded}
                  darkMode={darkMode}
                />
              </div>
            )}
            
            {userReview && (
              <div className="mb-8">
                <div className={`border rounded-lg p-4 mb-4 transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-blue-900/20 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${
                      darkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>Your Review</p>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className={`text-sm transition-colors ${
                        darkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Edit Review
                    </button>
                  </div>
                </div>
                
                {showReviewForm ? (
                  <ReviewForm
                    bookId={id}
                    existingReview={userReview}
                    onReviewAdded={handleReviewAdded}
                    darkMode={darkMode}
                  />
                ) : (
                  <Review
                    review={userReview}
                    onDeleteReview={handleDeleteReview}
                    darkMode={darkMode}
                  />
                )}
              </div>
            )}
          </SignedIn>

          {/* Sign in prompt */}
          <SignedOut>
            <div className={`border rounded-lg p-6 mb-8 text-center transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}>
              <FaUser className={`text-4xl mx-auto mb-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Sign in to leave a review</h3>
              <p className={`mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Share your thoughts about this book with other readers</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Sign In
              </button>
            </div>
          </SignedOut>

          {/* Reviews List */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              All Reviews ({reviews.length})
            </h3>
            
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews
                  .filter(review => review.userId !== user?.id) // Don't show user's own review in the list
                  .map((review) => (
                    <Review
                      key={review._id}
                      review={review}
                      onDeleteReview={handleDeleteReview}
                      darkMode={darkMode}
                    />
                  ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <p>No reviews yet. Be the first to review this book!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetails;
