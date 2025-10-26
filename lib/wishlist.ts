'use client';

import { Product } from '@/types';

const WISHLIST_KEY = 'newatlantic_wishlist';

export const WishlistManager = {
  // Get all wishlist items
  getWishlist: (): Product[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const wishlist = localStorage.getItem(WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  },

  // Add item to wishlist
  addToWishlist: (product: Product): boolean => {
    try {
      const wishlist = WishlistManager.getWishlist();
      
      // Check if already exists
      if (wishlist.some(item => item.id === product.id)) {
        return false;
      }
      
      wishlist.push(product);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
      
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: (productId: string): boolean => {
    try {
      const wishlist = WishlistManager.getWishlist();
      const filteredWishlist = wishlist.filter(item => item.id !== productId);
      
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(filteredWishlist));
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: filteredWishlist }));
      
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId: string): boolean => {
    const wishlist = WishlistManager.getWishlist();
    return wishlist.some(item => item.id === productId);
  },

  // Get wishlist count
  getWishlistCount: (): number => {
    return WishlistManager.getWishlist().length;
  },

  // Clear entire wishlist
  clearWishlist: (): void => {
    localStorage.removeItem(WISHLIST_KEY);
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: [] }));
  }
};
