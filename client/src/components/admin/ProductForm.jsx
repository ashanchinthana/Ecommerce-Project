// src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    category: '',
    stock: '',
    featured: false,
    image: '/api/placeholder/200/200' // Default placeholder
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discount: product.discount || 0,
        category: product.category || '',
        stock: product.stock || '',
        featured: product.featured || false,
        image: product.image || '/api/placeholder/200/200'
      });
    }
  }, [product]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (formData.discount && (isNaN(Number(formData.discount)) || Number(formData.discount) < 0 || Number(formData.discount) > 100)) {
      newErrors.discount = 'Discount must be a percentage between 0 and 100';
    }
    
    if (!formData.category) newErrors.category = 'Please select a category';
    
    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Convert numeric values
    const productData = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount),
      stock: Number(formData.stock)
    };
    
    onSubmit(productData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            // src/components/admin/ProductForm.jsx (continued)
            className={`w-full p-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full p-2 border rounded-md ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full p-2 border rounded-md ${
                errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className={`w-full p-2 border rounded-md ${
                errors.discount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.discount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.discount}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full p-2 border rounded-md ${
                errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Featured Product
          </label>
        </div>
        
        {/* In a complete implementation, you would add image upload functionality here */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Image
          </label>
          <div className="flex items-center">
            <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden mr-4">
              <img 
                src={formData.image} 
                alt="Product Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                For this demo, we're using placeholder images.
              </p>
              <button
                type="button"
                className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;