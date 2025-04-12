import api from './index';

// Get user cart
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart/items', { productId, quantity });
  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  const response = await api.put(`/cart/items/${productId}`, { quantity });
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/items/${productId}`);
  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

// Apply coupon code to cart
export const applyCoupon = async (couponCode) => {
  const response = await api.post('/cart/apply-coupon', { couponCode });
  return response.data;
};

// Remove coupon from cart
export const removeCoupon = async () => {
  const response = await api.delete('/cart/coupon');
  return response.data;
};