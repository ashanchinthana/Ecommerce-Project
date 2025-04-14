// src/App.jsx (updated with search route)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// User Pages
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import SearchResults from './pages/SearchResults';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p>This page is under construction. Check back soon!</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }
  
  if (requireAdmin && (!user || !user.isAdmin)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<PlaceholderPage title="About Us" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
          <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
          
          {/* Protected User Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation/:id" 
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="My Orders" />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ProductManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <OrderManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <PlaceholderPage title="User Management" />
              </ProtectedRoute>
            } 
          />
          
          {/* Additional Routes */}
          <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
          <Route path="/faq" element={<PlaceholderPage title="FAQs" />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping Information" />} />
          <Route path="/returns" element={<PlaceholderPage title="Returns & Exchanges" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
          <Route path="/privacy" element={<PlaceholderPage title="PrivacyPolicy" />} />
          
          {/* 404 Route */}
          <Route path="*" element={<PlaceholderPage title="Page Not Found (404)" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;