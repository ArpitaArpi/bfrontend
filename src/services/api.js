// API service for backend integration
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth headers with Clerk token
const getAuthHeaders = async () => {
  try {
    // Get Clerk token if available
    const token = await window.Clerk?.session?.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Cart API functions
export const cartAPI = {
  // Get user's cart from backend
  getCart: async (userId) => {
    return apiRequest(`/cart/${userId}`);
  },

  // Add item to cart
  addToCart: async (userId, item) => {
    return apiRequest(`/cart/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ item })
    });
  },

  // Update cart item quantity
  updateCartItem: async (userId, itemId, quantity) => {
    return apiRequest(`/cart/${userId}/update`, {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity })
    });
  },

  // Remove item from cart
  removeFromCart: async (userId, itemId) => {
    return apiRequest(`/cart/${userId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ itemId })
    });
  },

  // Clear entire cart
  clearCart: async (userId) => {
    return apiRequest(`/cart/${userId}/clear`, {
      method: 'DELETE'
    });
  },

  // Apply coupon to cart
  applyCoupon: async (userId, couponCode) => {
    return apiRequest(`/cart/${userId}/coupon`, {
      method: 'POST',
      body: JSON.stringify({ couponCode })
    });
  },

  // Remove coupon from cart
  removeCoupon: async (userId) => {
    return apiRequest(`/cart/${userId}/coupon`, {
      method: 'DELETE'
    });
  }
};

// Wishlist API functions
export const wishlistAPI = {
  // Get user's wishlist from backend
  getWishlist: async (userId) => {
    return apiRequest(`/wishlist/${userId}`);
  },

  // Add item to wishlist
  addToWishlist: async (userId, item) => {
    return apiRequest(`/wishlist/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ item })
    });
  },

  // Remove item from wishlist
  removeFromWishlist: async (userId, itemId) => {
    return apiRequest(`/wishlist/${userId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ itemId })
    });
  },

  // Clear entire wishlist
  clearWishlist: async (userId) => {
    return apiRequest(`/wishlist/${userId}/clear`, {
      method: 'DELETE'
    });
  }
};

// Orders API functions
export const ordersAPI = {
  // Get user's order history (matches existing endpoint)
  getOrderHistory: async (userId) => {
    return apiRequest(`/orders/user/${userId}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // Get order by ID
  getOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  // Update order status (admin only) - matches existing admin endpoint
  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
};

// Books API functions
export const booksAPI = {
  // Get all books (matches existing endpoint)
  getAllBooks: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/books${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get book by ID (matches existing endpoint)
  getBookById: async (bookId) => {
    return apiRequest(`/books/${bookId}`);
  },

  // Search books
  searchBooks: async (query) => {
    return apiRequest(`/books/search?q=${encodeURIComponent(query)}`);
  },

  // Get special categories (matches existing endpoints)
  getBestSellers: async () => {
    return apiRequest('/books/best-sellers');
  },

  getNewArrivals: async () => {
    return apiRequest('/books/new-arrivals');
  },

  getSpecialOffers: async () => {
    return apiRequest('/books/special-offers');
  },

  // Admin: Create new book (matches existing admin endpoint)
  createBook: async (bookData) => {
    return apiRequest('/admin/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },

  // Admin: Update book (matches existing admin endpoint)
  updateBook: async (bookId, bookData) => {
    return apiRequest(`/admin/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  },

  // Admin: Delete book (matches existing admin endpoint)
  deleteBook: async (bookId) => {
    return apiRequest(`/admin/books/${bookId}`, {
      method: 'DELETE'
    });
  }
};

// Reviews API functions
export const reviewsAPI = {
  // Get reviews for a book (matches existing endpoint)
  getBookReviews: async (bookId) => {
    return apiRequest(`/reviews/book/${bookId}`);
  },

  // Add review (matches existing endpoint)
  addReview: async (reviewData) => {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  // Update review (matches existing endpoint)
  updateReview: async (reviewId, reviewData) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  },

  // Delete review (matches existing admin endpoint)
  deleteReview: async (reviewId) => {
    return apiRequest(`/admin/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  },

  // Admin: Get all reviews (matches existing admin endpoint)
  getAllReviews: async () => {
    return apiRequest('/admin/reviews');
  }
};

// Users API functions (Admin) - matches existing admin endpoints
export const usersAPI = {
  // Get all users (admin only) - matches existing admin endpoint
  getAllUsers: async () => {
    return apiRequest('/admin/users');
  },

  // Get user by ID
  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }
};

// Admin stats API (matches existing admin endpoint)
export const adminAPI = {
  // Dashboard stats (matches existing admin endpoint)
  getDashboardStats: async () => {
    return apiRequest('/admin/stats');
  },

  // All admin functions from existing endpoints
  ...usersAPI,
  ...booksAPI,
  ...reviewsAPI,
  ...ordersAPI
};

export default {
  cartAPI,
  wishlistAPI,
  ordersAPI,
  booksAPI,
  reviewsAPI,
  usersAPI,
  adminAPI
};