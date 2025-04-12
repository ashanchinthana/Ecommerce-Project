import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products
        const featuredResponse = await getProducts({ featured: true, limit: 8 });
        setFeaturedProducts(featuredResponse.products);
        
        // Fetch new arrivals (most recent products)
        const newArrivalsResponse = await getProducts({ sortBy: 'createdAt', order: 'desc', limit: 8 });
        setNewArrivals(newArrivalsResponse.products);
        
        // Fetch best sellers
        const bestSellersResponse = await getProducts({ sortBy: 'sold', order: 'desc', limit: 8 });
        setBestSellers(bestSellersResponse.products);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hero slider settings
  const heroSlides = [
    {
      id: 1,
      image: '/assets/images/hero-1.jpg',
      title: 'New Summer Collection',
      description: 'Discover our latest arrivals perfect for the summer season',
      buttonText: 'Shop Now',
      buttonLink: '/products?category=summer',
    },
    {
      id: 2,
      image: '/assets/images/hero-2.jpg',
      title: 'Special Discount',
      description: 'Get up to 40% off on selected items',
      buttonText: 'View Offers',
      buttonLink: '/products?discount=true',
    },
    {
      id: 3,
      image: '/assets/images/hero-3.jpg',
      title: 'Premium Quality',
      description: 'Handcrafted products with premium materials',
      buttonText: 'Explore',
      buttonLink: '/products?premium=true',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Auto-advance slides every 5 seconds
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Category boxes
  const categories = [
    {
      name: 'Electronics',
      image: '/assets/images/category-electronics.jpg',
      link: '/products?category=Electronics',
    },
    {
      name: 'Clothing',
      image: '/assets/images/category-clothing.jpg',
      link: '/products?category=Clothing',
    },
    {
      name: 'Home & Kitchen',
      image: '/assets/images/category-home.jpg',
      link: '/products?category=Home%20%26%20Kitchen',
    },
    {
      name: 'Beauty',
      image: '/assets/images/category-beauty.jpg',
      link: '/products?category=Beauty%20%26%20Personal%20Care',
    },
  ];

  // If loading, show skeleton loader
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Hero skeleton */}
          <div className="h-96 bg-gray-300 rounded-lg mb-12"></div>
          
          {/* Categories skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          
          {/* Featured Products skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-300 w-1/4 mb-6 rounded"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
              ))}
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

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden mb-12">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="h-full flex items-center bg-black bg-opacity-40">
                <div className="container mx-auto px-4">
                  <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-white mb-6">{slide.description}</p>
                    <Link
                      to={slide.buttonLink}
                      className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full focus:outline-none ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.name} to={category.link}>
              <div className="group relative h-40 rounded-lg overflow-hidden shadow-md">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <Link
            to="/products?featured=true"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            New Arrivals
          </h2>
          <Link
            to="/products?sortBy=createdAt&order=desc"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Special Offer
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Get 20% off on all products when you sign up for our newsletter.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-md border-t border-b border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/assets/images/special-offer-banner.jpg"
                alt="Special Offer"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Best Sellers
          </h2>
          <Link
            to="/products?sortBy=sold&order=desc"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          What Our Customers Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              name: 'Sarah Johnson',
              avatar: '/assets/images/testimonial-1.jpg',
              text: 'I love shopping here! The products are high quality and the customer service is excellent.',
              rating: 5,
            },
            {
              id: 2,
              name: 'Michael Brown',
              avatar: '/assets/images/testimonial-2.jpg',
              text: 'Fast shipping and the products always exceed my expectations. Definitely recommend!',
              rating: 5,
            },
            {
              id: 3,
              name: 'Emily Williams',
              avatar: '/assets/images/testimonial-3.jpg',
              text: 'Great prices and even better quality. This is now my go-to online store for all my needs.',
              rating: 4,
            },
          ].map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              {
                title: 'Free Shipping',
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
                text: 'Free shipping on all orders over $50',
              },
              {
                title: 'Easy Returns',
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                ),
                text: '30-day easy return policy',
              },
              {
                title: 'Secure Payment',
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                text: '100% secure payment processing',
              },
              {
                title: '24/7 Support',
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                text: 'Customer support available 24/7',
              },
            ].map((feature, index) => (
              <div key={index} className="p-6">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;