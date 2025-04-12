import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/solid';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };
  
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/assets/images/default-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{product.name}</h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              ({product.reviews?.length || 0})
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              {product.discount > 0 ? (
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
          
          {product.countInStock <= 5 && product.countInStock > 0 && (
            <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
              Only {product.countInStock} left in stock!
            </p>
          )}
          
          {product.countInStock === 0 && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              Out of stock
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;