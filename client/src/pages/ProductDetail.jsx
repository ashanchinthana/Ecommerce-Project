import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { StarIcon } from '@heroicons/react/solid';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/outline';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Fetch related products (in a real app you'd have a dedicated API endpoint for this)
        // For now we'll just simulate it
        if (productData.category) {
          const relatedResponse = await getProducts({ 
            category: productData.category,
            limit: 4,
            exclude: productData._id
          });
          setRelatedProducts(relatedResponse.products);
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Calculate sale price if there's a discount
  const calculateSalePrice = (price, discount) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image gallery skeleton */}
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
            
            {/* Product info skeleton */}
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-300 w-3/4 mb-4 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/4 mb-6 rounded"></div>
              <div className="h-24 bg-gray-300 w-full mb-6 rounded"></div>
              <div className="h-8 bg-gray-300 w-1/2 mb-6 rounded"></div>
              <div className="h-12 bg-gray-300 w-full mb-6 rounded"></div>
              <div className="h-12 bg-gray-300 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-xl mb-4">Product not found</div>
          <Link
            to="/products"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400">Products</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary-600 dark:hover:text-primary-400">{product.category}</Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-700 dark:text-gray-300 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          {/* Main Image */}
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={product.images && product.images.length > 0 
                ? product.images[selectedImage] 
                : '/assets/images/default-product.jpg'}
              alt={product.name}
              className="w-full h-96 object-cover object-center"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-600 dark:border-primary-400'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            {product.discount > 0 ? (
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(calculateSalePrice(product.price, product.discount))}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          
          {/* Availability */}
          <div className="mb-6">
            {product.countInStock > 0 ? (
              <span className="text-green-600 dark:text-green-400 font-medium">
                In Stock ({product.countInStock} available)
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-6 prose dark:prose-invert">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
          </div>
          
          {/* Features/Specs if available */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Features</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Quantity Selector */}
          {product.countInStock > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="p-2 rounded-l-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  -
                </button>
                <span className="w-12 text-center py-2 border-t border-b border-gray-300 dark:border-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 rounded-r-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  disabled={quantity >= product.countInStock}
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md text-white ${
                product.countInStock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            
            <button className="p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Reviews, etc. */}
      <div className="mt-16">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex -mb-px">
            <li className="mr-1">
              <a href="#description" className="inline-block py-4 px-4 text-sm font-medium text-center border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400">
                Description
              </a>
            </li>
            <li className="mr-1">
              <a href="#reviews" className="inline-block py-4 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600">
                Reviews ({product.reviews?.length || 0})
              </a>
            </li>
            <li>
              <a href="#shipping" className="inline-block py-4 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600">
                Shipping
              </a>
            </li>
          </ul>
        </div>
        
        <div id="description" className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Description
          </h2>
          <div className="prose max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            
            {/* Additional description content would go here */}
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            {/* Product specs as a table */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">Specifications</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Brand</td>
                  <td className="py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.brand}</td>
                </tr>
                <tr>
                  <td className="py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Category</td>
                  <td className="py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.category}</td>
                </tr>
                <tr>
                  <td className="py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Weight</td>
                  <td className="py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">0.5 kg</td>
                </tr>
                <tr>
                  <td className="py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Dimensions</td>
                  <td className="py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">10 x 5 x 3 cm</td>
                </tr>
                <tr>
                  <td className="py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Material</td>
                  <td className="py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Premium Quality</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : '/assets/images/default-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{product.name}</h3>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;