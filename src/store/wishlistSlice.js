import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Initial state for wishlist (will be loaded from backend)
const initialState = {
  items: [],
  loading: false,
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const { book } = action.payload;
      const existingItem = state.items.find(item => item.id === book._id || item.id === book.id);
      
      if (!existingItem) {
        const wishlistItem = {
          id: book._id || book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          coverImageUrl: book.coverImageUrl,
          category: book.category,
          averageRating: book.averageRating,
          reviewCount: book.reviewCount,
          dateAdded: new Date().toISOString()
        };
        state.items.push(wishlistItem);
        toast.success(`${book.title} added to wishlist ❤️`);
      } else {
        toast.info(`${book.title} is already in your wishlist`);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const { bookId } = action.payload;
      const item = state.items.find(item => item.id === bookId);
      
      if (item) {
        state.items = state.items.filter(item => item.id !== bookId);
        toast.success(`${item.title} removed from wishlist`);
      }
    },
    
    clearWishlist: (state) => {
      state.items = [];
      toast.success('Wishlist cleared');
    },
    
    // Check if item is in wishlist (utility function)
    isInWishlist: (state, action) => {
      const bookId = action.payload;
      return state.items.some(item => item.id === bookId);
    },
    
    // Load wishlist from backend API
    loadWishlistFromBackend: (state, action) => {
      const wishlistData = action.payload;
      state.items = wishlistData.items || [];
    },
    
    // Set loading state for wishlist operations
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Handle wishlist sync errors
    setWishlistError: (state, action) => {
      state.error = action.payload;
      if (action.payload) {
        toast.error('Failed to sync wishlist with server');
      }
    }
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  isInWishlist,
  loadWishlistFromBackend,
  setWishlistLoading,
  setWishlistError
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, bookId) => 
  state.wishlist.items.some(item => item.id === bookId);

export default wishlistSlice.reducer;