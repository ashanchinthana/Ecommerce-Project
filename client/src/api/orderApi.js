import api from './index';

// Create new order
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Get user's orders
export const getUserOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Pay for order
export const payOrder = async (orderId, paymentResult) => {
  const response = await api.put(`/orders/${orderId}/pay`, paymentResult);
  return response.data;
};

// Admin: Get all orders
export const getAllOrders = async (filters = {}) => {
  // Prepare query string from filters object
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const response = await api.get(`/orders?${queryParams.toString()}`);
  return response.data;
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

// File: ecommerce-platform/client/src/api/userApi.js
import api from './index';

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Add address to user profile
export const addUserAddress = async (address) => {
  const response = await api.post('/users/addresses', address);
  return response.data;
};

// Update user address
export const updateUserAddress = async (addressId, address) => {
  const response = await api.put(`/users/addresses/${addressId}`, address);
  return response.data;
};

// Delete user address
export const deleteUserAddress = async (addressId) => {
  const response = await api.delete(`/users/addresses/${addressId}`);
  return response.data;
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  const response = await api.put(`/users/addresses/${addressId}/default`);
  return response.data;
};

// Admin: Get all users
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Admin: Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Admin: Update user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Admin: Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};