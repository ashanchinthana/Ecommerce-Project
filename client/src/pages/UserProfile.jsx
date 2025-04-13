// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiLogOut
} from 'react-icons/fi';

// Profile component tabs
import ProfileInfo from '../components/profile/ProfileInfo';
import OrderHistory from '../components/profile/OrderHistory';
import SavedAddresses from '../components/profile/SavedAddresses';
import PaymentMethods from '../components/profile/PaymentMethods';
import Wishlist from '../components/profile/Wishlist';

const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Tabs for the profile page
  const tabs = [
    { id: 'profile', name: 'Personal Information', icon: FiUser },
    { id: 'orders', name: 'Order History', icon: FiShoppingBag },
    { id: 'addresses', name: 'Addresses', icon: FiMapPin },
    { id: 'payment', name: 'Payment Methods', icon: FiCreditCard },
    { id: 'wishlist', name: 'Wishlist', icon: FiHeart }
  ];
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} />;
      case 'orders':
        return <OrderHistory />;
      case 'addresses':
        return <SavedAddresses />;
      case 'payment':
        return <PaymentMethods />;
      case 'wishlist':
        return <Wishlist />;
      default:
        return <ProfileInfo user={user} />;
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 dark:text-white">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4 lg:w-1/5">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {/* User info */}
            <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            
            {/* Navigation tabs */}
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiLogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4 lg:w-4/5">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;