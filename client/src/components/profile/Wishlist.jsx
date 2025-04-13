import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { FiHeart as HeartSolid } from "react-icons/fi";
import { Link } from "react-router-dom";

const Wishlist = () => {
  // In a real application, this would come from an API or context
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 199.99,
      image: "/images/products/headphones.jpg",
      inStock: true,
      rating: 4.5,
      category: "Electronics",
      dateAdded: "2024-03-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      price: 249.99,
      image: "/images/products/chair.jpg",
      inStock: true,
      rating: 4.2,
      category: "Furniture",
      dateAdded: "2024-04-02T14:15:00Z",
    },
    {
      id: 3,
      name: "Handcrafted Ceramic Mug Set",
      price: 34.99,
      image: "/images/products/mugs.jpg",
      inStock: false,
      rating: 4.8,
      category: "Home & Kitchen",
      dateAdded: "2024-04-05T09:45:00Z",
    },
    {
      id: 4,
      name: "Waterproof Hiking Boots",
      price: 129.99,
      image: "/images/products/boots.jpg",
      inStock: true,
      rating: 4.3,
      category: "Footwear",
      dateAdded: "2024-03-20T11:20:00Z",
    },
  ]);

  const [sortOption, setSortOption] = useState("dateAdded");
  const [filterStock, setFilterStock] = useState("all");

  // Sort function for wishlist items
  const getSortedItems = () => {
    let filteredItems = [...wishlistItems];
    
    // Apply stock filter
    if (filterStock === "inStock") {
      filteredItems = filteredItems.filter(item => item.inStock);
    } else if (filterStock === "outOfStock") {
      filteredItems = filteredItems.filter(item => !item.inStock);
    }
    
    // Apply sorting
    return filteredItems.sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "ratingDesc":
          return b.rating - a.rating;
        case "dateAdded":
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });
  };

  // Function to remove item from wishlist
  const handleRemoveItem = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  // Simulate add to cart functionality
  const handleAddToCart = (itemId) => {
    // In a real app, this would add to cart context/state
    alert(`Item ${itemId} added to cart!`);
    
    // Optionally remove from wishlist after adding to cart
    // handleRemoveItem(itemId);
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
  };

  // Placeholder images when real product images aren't available
  const getPlaceholderImage = (category) => {
    switch (category) {
      case "Electronics":
        return "bg-blue-100";
      case "Furniture":
        return "bg-amber-100";
      case "Home & Kitchen":
        return "bg-green-100";
      case "Footwear":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const sortedItems = getSortedItems();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">
          My Wishlist ({wishlistItems.length} items)
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Filter dropdown */}
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="all">All Items</option>
            <option value="inStock">In Stock Only</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
          
          {/* Sort dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="dateAdded">Recently Added</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
            <option value="ratingDesc">Highest Rated</option>
          </select>
          
          {/* Clear wishlist button */}
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Items you save to your wishlist will appear here.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Product image */}
              <div 
                className={`${getPlaceholderImage(item.category)} h-48 flex items-center justify-center relative`}
              >
                <span className="text-4xl text-gray-400">
                  {item.category.charAt(0)}
                </span>
                
                {/* In stock badge */}
                <div className="absolute top-2 right-2">
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                {/* Remove from wishlist button */}
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-2 left-2 text-gray-500 hover:text-red-600"
                  aria-label="Remove from wishlist"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                {/* Product info */}
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  <Link to={`/products/${item.id}`} className="hover:text-indigo-600">
                    {item.name}
                  </Link>
                </h3>
                
                <div className="flex items-center mb-2">
                  <span className="text-amber-500 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                  </span>
                </div>
                
                <p className="text-lg font-medium text-gray-900 dark:text-white mt-auto">
                  ${item.price.toFixed(2)}
                </p>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    disabled={!item.inStock}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded ${
                      item.inStock
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingCart className="h-4 w-4 mr-1" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;