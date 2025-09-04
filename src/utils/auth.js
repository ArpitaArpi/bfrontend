import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

// Admin user detection hook
export const useIsAdmin = () => {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Check if user has admin role in public metadata or email domains
      const adminEmails = ['admin@bookbazar.com', 'owner@bookbazar.com'];
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      
      // Check admin role from user metadata or specific admin emails
      const hasAdminRole = user?.publicMetadata?.role === 'admin' || 
                          user?.privateMetadata?.role === 'admin' ||
                          adminEmails.includes(userEmail);
      
      setIsAdmin(hasAdminRole);
      setLoading(false);
    }
  }, [user, isLoaded]);

  return { isAdmin, loading, user };
};

// Check if current user is admin (synchronous version)
export const checkIsAdmin = (user) => {
  if (!user) return false;
  
  const adminEmails = ['admin@bookbazar.com', 'owner@bookbazar.com'];
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  
  return user?.publicMetadata?.role === 'admin' || 
         user?.privateMetadata?.role === 'admin' ||
         adminEmails.includes(userEmail);
};

// API helper for admin operations
export const adminAPI = {
  // Books management
  addBook: async (bookData) => {
    const response = await fetch('http://localhost:5001/api/admin/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return response.json();
  },

  updateBook: async (id, bookData) => {
    const response = await fetch(`http://localhost:5001/api/admin/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return response.json();
  },

  deleteBook: async (id) => {
    const response = await fetch(`http://localhost:5001/api/admin/books/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Users management
  getAllUsers: async () => {
    const response = await fetch('http://localhost:5001/api/admin/users');
    return response.json();
  },

  // Orders management
  getAllOrders: async () => {
    const response = await fetch('http://localhost:5001/api/admin/orders');
    return response.json();
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`http://localhost:5001/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Reviews management
  getAllReviews: async () => {
    const response = await fetch('http://localhost:5001/api/admin/reviews');
    return response.json();
  },

  deleteReview: async (id) => {
    const response = await fetch(`http://localhost:5001/api/admin/reviews/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await fetch('http://localhost:5001/api/admin/stats');
    return response.json();
  }
};