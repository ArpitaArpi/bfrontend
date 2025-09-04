

import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from "react";
import { FaCartPlus, FaEdit, FaFire, FaHeart, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { addToCart } from '../../store/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../store/wishlistSlice';

const BookCard = ({
  id,
  title,
  author,
  price,
  coverImageUrl,
  category,
  trending,
  onEdit,
}) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const isInWishlist = useSelector(state => selectIsInWishlist(state, id));
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  useEffect(() => {
    fetchBookRatings();
  }, [id]);

  const fetchBookRatings = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/book/${id}`);
      const data = await response.json();
      setAverageRating(data.averageRating || 0);
      setReviewCount(data.reviews?.length || 0);
    } catch (error) {
      console.error('Error fetching book ratings:', error);
      setAverageRating(0);
      setReviewCount(0);
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleAddToCart = () => {
    const book = {
      _id: id,
      id: id,
      title,
      author,
      price,
      coverImageUrl,
      category
    };
    dispatch(addToCart({ book, quantity: 1 }));
  };

  const handleWishlistToggle = () => {
    const book = {
      _id: id,
      id: id,
      title,
      author,
      price,
      coverImageUrl,
      category,
      averageRating,
      reviewCount
    };
    
    if (isInWishlist) {
      dispatch(removeFromWishlist({ bookId: id }));
    } else {
      dispatch(addToWishlist({ book }));
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-xs ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };
  return (
    <div className="relative group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 p-2 rounded-full transition ${
          isInWishlist
            ? 'bg-pink-500 text-white'
            : 'bg-white/80 text-gray-600 hover:bg-pink-500 hover:text-white'
        }`}
        title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <FaHeart className="text-sm" />
      </button>

      {/* Trending Badge */}
      {trending && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <FaFire /> Trending
        </span>
      )}

      {/* Book Image */}
      <div className="h-64 overflow-hidden rounded-t-2xl">
        <img
          src={coverImageUrl || "https://placehold.co/220x300?text=No+Image"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Book Info */}
      <div className="p-5 flex flex-col justify-between h-60">
        <div>
          <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{title}</h2>
          <p className="text-gray-500 text-sm mb-2">by {author}</p>
          
          {/* Rating Display */}
          {!ratingsLoading && averageRating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-2">
                {renderStars(averageRating)}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}
          
          {category && (
            <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>

        {/* Price + Actions */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-lg font-bold text-indigo-700">
            {price ? `$${price}` : "Contact for price"}
          </span>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-2">
            <Link
              to={`/books/${id}`}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              View Details
            </Link>

            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <FaEdit className="text-gray-600" />
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition ${
                  isInWishlist
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-200 text-gray-600 hover:bg-pink-500 hover:text-white'
                }`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <FaHeart />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition"
                title="Add to Cart"
              >
                <FaCartPlus className="text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
