/**
 * Application constants
 */

// API Status
export const API_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
  };
  
  // Order Status
  export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  };
  
  // Payment Status
  export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  };
  
  // User Roles
  export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
  };
  
  // Product Categories
  export const PRODUCT_CATEGORIES = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
    'Toys & Games',
  ];
  
  // Pagination
  export const ITEMS_PER_PAGE = 12;
  
  // Storage URLs
  export const STORAGE_URL = 'https://your-storage-url.com';
  export const DEFAULT_PRODUCT_IMAGE = '/assets/images/default-product.jpg';
  export const DEFAULT_AVATAR = '/assets/images/default-avatar.jpg';