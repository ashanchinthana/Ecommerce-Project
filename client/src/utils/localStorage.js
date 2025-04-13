/**
 * Utility functions for working with localStorage
 */

// Set authentication token
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Get authentication token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Remove authentication token
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Store cart data
export const storeCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Get cart data
export const getStoredCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : null;
};

// Clear cart data
export const clearStoredCart = () => {
  localStorage.removeItem('cart');
};

// Store user preferences
export const storePreferences = (preferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

// Get user preferences
export const getStoredPreferences = () => {
  const preferences = localStorage.getItem('userPreferences');
  return preferences ? JSON.parse(preferences) : null;
};