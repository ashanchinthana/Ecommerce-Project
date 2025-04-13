// src/components/common/Navbar.jsx (updated with new search)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { ShoppingBagIcon, UserIcon, MoonIcon, SunIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import SearchBar from '../search/SearchBar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
    
    // Apply dark mode class
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ShopNow
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Contact
            </Link>
          </nav>

          {/* Desktop Search, Cart, User */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="w-64">
              <SearchBar />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <ShoppingBagIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium border-b dark:border-gray-700">
                    {user.name}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Orders
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingBagIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <SearchBar />
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                Contact
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                {isDarkMode ? (
                  <>
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* User Options */}
              {isAuthenticated ? (
                <>
                  <div className="py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {user.name}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Orders
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;