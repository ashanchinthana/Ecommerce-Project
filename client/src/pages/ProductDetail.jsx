// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/outline';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getProductById(id);
        setProduct(data.product);
        setSelectedImage(0); // Reset selected image when product changes
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        images: product.images,
        quantity
      });
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 w-1/3 mb-6 rounded"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 w-2/3 rounded"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 w-1/4 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 w-full rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 w-full rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 w-3/4 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 w-1/3 rounded"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
          >
            Try Again
          </button>
        </div>
        <Link
          to="/products"
          className="flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }
  
  // Render no product state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Product not found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
          >
            Browse all products
          </Link>
        </div>
      </div>
    );
  }
  
  const {
    name,
    description,
    price,
    discount,
    images,
    rating,
    numReviews,
    stockCount,
    category,
    brand,
    specifications
  } = product;
  
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${category}`} className="hover:text-primary-600 dark:hover:text-primary-400">{category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
            <img
              src={images && images.length > 0 ? images[selectedImage] : '/api/placeholder/600/600'}
              alt={name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          {/* Thumbnail Images */}
          {images && images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-600 dark:border-primary-400'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${name} - view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(rating) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({numReviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="mt-4">
            {discount > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {formatCurrency(price)}
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          
          {/* Availability */}
          <div className="mt-2">
            {stockCount > 0 ? (
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                In Stock ({stockCount} available)
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Description */}
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>
          
          {/* Brand */}
          {brand && (
            <div className="mt-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">Brand: </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{brand}</span>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="mt-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className={`p-2 border border-gray-300 rounded-l-md ${
                  quantity <= 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
                } dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={incrementQuantity}
                className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={stockCount <= 0}
              className={`flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                stockCount <= 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Specifications */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Specifications</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(specifications).map(([key, value]) => (
                    <li key={key} className="flex py-3 px-4">
                      <span className="w-1/3 text-gray-600 dark:text-gray-400">{key}</span>
                      <span className="w-2/3 text-gray-900 dark:text-white">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You might also like</h2>
        
        {/* This would normally fetch related products from the API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Related Product {index + 1}</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Related Product</h3>
                <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">${(Math.random() * 100 + 10).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;