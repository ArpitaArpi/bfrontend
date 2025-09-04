import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadCartFromBackend } from '../store/cartSlice';
import { loadWishlistFromBackend } from '../store/wishlistSlice';
import { cartAPI, wishlistAPI } from '../services/api';
import { toast } from 'react-toastify';

// Hook for syncing cart with backend
export const useCartSync = () => {
  const dispatch = useDispatch();
  const { user } = useUser();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user?.id) {
      loadCartFromBackendAPI(user.id);
    }
  }, [user?.id, dispatch]);

  const loadCartFromBackendAPI = async (userId) => {
    try {
      const cartData = await cartAPI.getCart(userId);
      dispatch(loadCartFromBackend(cartData));
    } catch (error) {
      console.error('Failed to load cart from backend:', error);
    }
  };

  // Helper functions for cart operations with backend sync
  const syncCart = async (action, data = {}) => {
    if (!user?.id) return;

    try {
      switch (action) {
        case 'add':
          await cartAPI.addToCart(user.id, data.item);
          break;
        case 'update':
          await cartAPI.updateCartItem(user.id, data.itemId, data.quantity);
          break;
        case 'remove':
          await cartAPI.removeFromCart(user.id, data.itemId);
          break;
        case 'clear':
          await cartAPI.clearCart(user.id);
          break;
        case 'applyCoupon':
          await cartAPI.applyCoupon(user.id, data.couponCode);
          break;
        case 'removeCoupon':
          await cartAPI.removeCoupon(user.id);
          break;
      }
      // Reload cart after successful sync
      loadCartFromBackendAPI(user.id);
    } catch (error) {
      console.error('Failed to sync cart:', error);
      toast.error('Failed to sync with server');
    }
  };

  return {
    syncAddToCart: (item) => syncCart('add', { item }),
    syncUpdateCartItem: (itemId, quantity) => syncCart('update', { itemId, quantity }),
    syncRemoveFromCart: (itemId) => syncCart('remove', { itemId }),
    syncClearCart: () => syncCart('clear'),
    syncApplyCoupon: (couponCode) => syncCart('applyCoupon', { couponCode }),
    syncRemoveCoupon: () => syncCart('removeCoupon'),
    loadCartFromBackend: () => loadCartFromBackendAPI(user?.id)
  };
};

// Hook for syncing wishlist with backend
export const useWishlistSync = () => {
  const dispatch = useDispatch();
  const { user } = useUser();

  // Load wishlist from backend when user logs in
  useEffect(() => {
    if (user?.id) {
      loadWishlistFromBackendAPI(user.id);
    }
  }, [user?.id, dispatch]);

  const loadWishlistFromBackendAPI = async (userId) => {
    try {
      const wishlistData = await wishlistAPI.getWishlist(userId);
      dispatch(loadWishlistFromBackend(wishlistData));
    } catch (error) {
      console.error('Failed to load wishlist from backend:', error);
    }
  };

  // Helper functions for wishlist operations with backend sync
  const syncWishlist = async (action, data = {}) => {
    if (!user?.id) return;

    try {
      switch (action) {
        case 'add':
          await wishlistAPI.addToWishlist(user.id, data.item);
          break;
        case 'remove':
          await wishlistAPI.removeFromWishlist(user.id, data.itemId);
          break;
        case 'clear':
          await wishlistAPI.clearWishlist(user.id);
          break;
      }
      // Reload wishlist after successful sync
      loadWishlistFromBackendAPI(user.id);
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
      toast.error('Failed to sync with server');
    }
  };

  return {
    syncAddToWishlist: (item) => syncWishlist('add', { item }),
    syncRemoveFromWishlist: (itemId) => syncWishlist('remove', { itemId }),
    syncClearWishlist: () => syncWishlist('clear'),
    loadWishlistFromBackend: () => loadWishlistFromBackendAPI(user?.id)
  };
};

// Combined hook for both cart and wishlist sync
export const useBackendSync = () => {
  const cartSync = useCartSync();
  const wishlistSync = useWishlistSync();

  return {
    ...cartSync,
    ...wishlistSync
  };
};

// Hook for initializing user data when they log in
export const useInitializeUserData = () => {
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user?.id) {
      // Load both cart and wishlist when user logs in
      loadUserCart(user.id);
      loadUserWishlist(user.id);
    }
  }, [isLoaded, user?.id, dispatch]);

  const loadUserCart = async (userId) => {
    try {
      const cartData = await cartAPI.getCart(userId);
      dispatch(loadCartFromBackend(cartData));
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadUserWishlist = async (userId) => {
    try {
      const wishlistData = await wishlistAPI.getWishlist(userId);
      dispatch(loadWishlistFromBackend(wishlistData));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };
};

export default {
  useCartSync,
  useWishlistSync,
  useBackendSync,
  useInitializeUserData
};