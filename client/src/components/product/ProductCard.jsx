// src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Safely handle missing product data
  if (!product) return null;
  
  const {
    _id,
    name,
    price,
    discount,
    images,
    category
  } = product;
  
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${_id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={images && images.length > 0 ? images[0] : '/api/placeholder/300/300'} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${_id}`} className="block">
          <span className="text-xs text-gray-500 dark:text-gray-400">{category}</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-1 hover:text-primary-600 dark:hover:text-primary-400">
            {name || 'Product Name'}
          </h3>
          
          <div className="mt-2 flex items-center">
            {discount > 0 ? (
              <>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </Link>
        
        <button
          onClick={() => addToCart(product, 1)}
          className="mt-4 w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;