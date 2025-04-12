import api from './index';

// Get all products with optional filters
export const getProducts = async (filters = {}) => {
  // Prepare query string from filters object
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const response = await api.get(`/products?${queryParams.toString()}`);
  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get product categories
export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

// Search products
export const searchProducts = async (query) => {
  const response = await api.get(`/products/search?q=${query}`);
  return response.data;
};

// Admin: Create new product
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Admin: Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Admin: Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Admin: Upload product image
export const uploadProductImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await api.post(`/products/${id}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};