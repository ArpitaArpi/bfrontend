import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Calculate totals
const calculateTotals = (items) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { itemCount, total };
};
const initialState = {
  items: [], 
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { book, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === book._id || item.id === book.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        toast.success(`Updated ${book.title} quantity in cart`);
      } else {
        const cartItem = {
          id: book._id || book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          coverImageUrl: book.coverImageUrl,
          category: book.category,
          quantity: quantity,
        };
        state.items.push(cartItem);
        toast.success(`${book.title} added to cart`);
      }
      
      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
    },
    
    removeFromCart: (state, action) => {
      const { bookId } = action.payload;
      const item = state.items.find(item => item.id === bookId);
      
      if (item) {
        state.items = state.items.filter(item => item.id !== bookId);
        toast.success(`${item.title} removed from cart`);
        
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.total = totals.total;
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        toast.success(`Updated ${item.title} quantity`);
        
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.total = totals.total;
      } else if (item && quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id);
        toast.success(`${item.title} removed from cart`);
        
        const totals = calculateTotals(state.items);
        state.itemCount = totals.itemCount;
        state.total = totals.total;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      toast.success('Cart cleared');
    },
    
    applyCoupon: (state, action) => {
      const { couponCode, discountPercent } = action.payload;
      if (state.total > 0) {
        const discountAmount = (state.total * discountPercent) / 100;
        state.discount = discountAmount;
        state.couponCode = couponCode;
        state.finalTotal = state.total - discountAmount;
        toast.success(`Coupon ${couponCode} applied! Saved $${discountAmount.toFixed(2)}`);
      }
    },
    
    removeCoupon: (state) => {
      delete state.discount;
      delete state.couponCode;
      delete state.finalTotal;
      toast.info('Coupon removed');
    },
    
    // Load cart from backend API
    loadCartFromBackend: (state, action) => {
      const cartData = action.payload;
      state.items = cartData.items || [];
      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
      state.discount = cartData.discount;
      state.couponCode = cartData.couponCode;
      state.finalTotal = cartData.finalTotal;
    },
    
    // Set loading state for cart operations
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Handle cart sync errors
    setCartError: (state, action) => {
      state.error = action.payload;
      if (action.payload) {
        toast.error('Failed to sync cart with server');
      }
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  loadCartFromBackend,
  setCartLoading,
  setCartError
} = cartSlice.actions;

export default cartSlice.reducer;