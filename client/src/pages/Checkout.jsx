// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';

// Step components
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderReview from '../components/checkout/OrderReview';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Checkout steps
  const STEPS = {
    SHIPPING: 1,
    PAYMENT: 2,
    REVIEW: 3
  };
  
  const [currentStep, setCurrentStep] = useState(STEPS.SHIPPING);
  const [formData, setFormData] = useState({
    shipping: {
      fullName: user?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phoneNumber: ''
    },
    payment: {
      cardNumber: '',
      nameOnCard: '',
      expiryDate: '',
      cvv: ''
    },
    shippingMethod: 'standard'
  });
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  // Navigate to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Navigate to cart if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderProcessing) {
      navigate('/cart');
    }
  }, [cart, navigate, orderProcessing]);
  
  // Calculate order totals
  const subtotal = total;
  const shipping = formData.shippingMethod === 'express' ? 15.99 : subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const orderTotal = subtotal + shipping + tax;
  
  // Handle form data changes
  const handleChange = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data
      }
    }));
  };
  
  // Handle shipping method selection
  const handleShippingMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: method
    }));
  };
  
  // Move to next step
  const handleNextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => {
      if (prev === STEPS.SHIPPING) return STEPS.PAYMENT;
      if (prev === STEPS.PAYMENT) return STEPS.REVIEW;
      return prev;
    });
  };
  
  // Move to previous step
  const handlePrevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => {
      if (prev === STEPS.PAYMENT) return STEPS.SHIPPING;
      if (prev === STEPS.REVIEW) return STEPS.PAYMENT;
      return prev;
    });
  };
  
  // Submit order
  const handlePlaceOrder = async () => {
    setOrderProcessing(true);
    
    try {
      // Simulate API call to process order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock order
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Clear cart
      clearCart();
      
      // Navigate to confirmation page
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="relative flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              currentStep >= STEPS.SHIPPING 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              1
            </div>
            <div className="hidden md:block ml-3 font-medium text-sm">Shipping</div>
          </div>
          <div className={`flex-1 h-1 mx-4 ${
            currentStep > STEPS.SHIPPING ? 'bg-primary-600' : 'bg-gray-300'
          }`}></div>
          <div className="relative flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              currentStep >= STEPS.PAYMENT 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              2
            </div>
            <div className="hidden md:block ml-3 font-medium text-sm">Payment</div>
          </div>
          <div className={`flex-1 h-1 mx-4 ${
            currentStep > STEPS.PAYMENT ? 'bg-primary-600' : 'bg-gray-300'
          }`}></div>
          <div className="relative flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
              currentStep === STEPS.REVIEW 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              3
            </div>
            <div className="hidden md:block ml-3 font-medium text-sm">Review</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Step 1: Shipping */}
            {currentStep === STEPS.SHIPPING && (
              <ShippingForm 
                data={formData.shipping}
                shippingMethod={formData.shippingMethod}
                onChange={(data) => handleChange('shipping', data)}
                onShippingMethodChange={handleShippingMethodChange}
                onSubmit={handleNextStep}
              />
            )}
            
            {/* Step 2: Payment */}
            {currentStep === STEPS.PAYMENT && (
              <PaymentForm 
                data={formData.payment}
                onChange={(data) => handleChange('payment', data)}
                onBack={handlePrevStep}
                onSubmit={handleNextStep}
              />
            )}
            
            {/* Step 3: Review */}
            {currentStep === STEPS.REVIEW && (
              <OrderReview 
                shippingDetails={formData.shipping}
                paymentDetails={formData.payment}
                shippingMethod={formData.shippingMethod}
                cartItems={cart}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={orderTotal}
                onBack={handlePrevStep}
                onPlaceOrder={handlePlaceOrder}
                processing={orderProcessing}
              />
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Order Summary</h2>
            
            {cart.length > 0 && (
              <div className="mb-6 max-h-80 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="h-16 w-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mr-4">
                      <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : '/api/placeholder/80/80'}  
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium dark:text-white">{item.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium dark:text-white">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                <span className="font-medium dark:text-white">{formatCurrency(tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold dark:text-white">Total</span>
                  <span className="font-semibold dark:text-white">{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;