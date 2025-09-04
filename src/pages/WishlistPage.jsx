import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../store/cartSlice';
import { clearWishlist, removeFromWishlist, selectWishlistItems } from '../store/wishlistSlice';

const WishlistPage = ({ darkMode }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleRemoveFromWishlist = (bookId) => {
    dispatch(removeFromWishlist({ bookId }));
  };

  const handleAddToCart = (book) => {
    dispatch(addToCart({ book, quantity: 1 }));
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length > 0) {
      if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
        dispatch(clearWishlist());
      }
    }
  };

  const handleMoveAllToCart = () => {
    if (wishlistItems.length > 0) {
      wishlistItems.forEach(book => {
        dispatch(addToCart({ book, quantity: 1 }));
      });
      dispatch(clearWishlist());
      toast.success('All items moved to cart!');
    }
  };

  return (
    <div className={`min-h-screen py-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">My Wishlist ❤️</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your favorite books saved for later
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMoveAllToCart}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Move All to Cart
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Clear Wishlist
                </button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid gap-6">
              {wishlistItems.map((book) => (
                <div
                  key={book.id}
                  className={`flex flex-col sm:flex-row gap-6 p-6 rounded-lg shadow-lg transition-transform hover:scale-[1.02] ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  {/* Book Image */}
                  <div className="flex-shrink-0">
                    <Link to={`/books/${book.id}`}>
                      <img
                        src={book.coverImageUrl || "https://placehold.co/150x200?text=No+Image"}
                        alt={book.title}
                        className="w-full sm:w-32 h-48 sm:h-44 object-cover rounded-lg hover:opacity-80 transition"
                      />
                    </Link>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <Link 
                          to={`/books/${book.id}`}
                          className="text-xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                          {book.title}
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          by {book.author}
                        </p>
                        {book.category && (
                          <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm mt-2">
                            {book.category}
                          </span>
                        )}
                        
                        {/* Rating */}
                        {book.averageRating > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < Math.floor(book.averageRating)
                                      ? 'text-yellow-500'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              ({book.reviewCount || 0} reviews)
                            </span>
                          </div>
                        )}

                        {/* Date Added */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Added {new Date(book.dateAdded).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          ${book.price}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(book)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(book.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50">💔</div>
            <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Start adding books you love to your wishlist
            </p>
            <Link
              to="/all-books"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-medium text-lg"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;