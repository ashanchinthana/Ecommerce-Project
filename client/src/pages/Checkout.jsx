import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../api/orderApi';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { cart, clear, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    paymentMethod: 'credit_card',
    cardDetails: {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      nameOnCard: '',
    },
  });
  
  const [errors, setErrors] = useState({});
  const [formStep, setFormStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // Pre-fill with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          fullName: user.name || '',
          ...(user.defaultAddress || {}),
        },
      }));
    }
  }, [user]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart.items || cart.items.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested form data
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateShippingForm = () => {
    const newErrors = {};
    const { shippingAddress } = formData;
    
    if (!shippingAddress.fullName) newErrors['shippingAddress.fullName'] = 'Full name is required';
    if (!shippingAddress.address) newErrors['shippingAddress.address'] = 'Address is required';
    if (!shippingAddress.city) newErrors['shippingAddress.city'] = 'City is required';
    if (!shippingAddress.postalCode) newErrors['shippingAddress.postalCode'] = 'Postal code is required';
    if (!shippingAddress.country) newErrors['shippingAddress.country'] = 'Country is required';
    if (!shippingAddress.phone) newErrors['shippingAddress.phone'] = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentForm = () => {
    const newErrors = {};
    const { cardDetails, paymentMethod } = formData;
    
    if (paymentMethod === 'credit_card') {
      if (!cardDetails.cardNumber) newErrors['cardDetails.cardNumber'] = 'Card number is required';
      else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors['cardDetails.cardNumber'] = 'Invalid card number';
      }
      
      if (!cardDetails.expirationDate) newErrors['cardDetails.expirationDate'] = 'Expiration date is required';
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expirationDate)) {
        newErrors['cardDetails.expirationDate'] = 'Invalid format (MM/YY)';
      }
      
      if (!cardDetails.cvv) newErrors['cardDetails.cvv'] = 'CVV is required';
      else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors['cardDetails.cvv'] = 'Invalid CVV';
      }
      
      if (!cardDetails.nameOnCard) newErrors['cardDetails.nameOnCard'] = 'Name on card is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (formStep === 1) {
      if (validateShippingForm()) {
        setFormStep(2);
        window.scrollTo(0, 0);
      }
    } else if (formStep === 2) {
      if (validatePaymentForm()) {
        setFormStep(3);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const handlePreviousStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      
      // Create order object
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0] || '',
          price: item.product.price,
          discount: item.product.discount,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        itemsPrice: cart.total,
        shippingPrice: cart.total >= 50 ? 0 : 5.99,
        taxPrice: cart.total * 0.08,
        totalPrice: cart.total + (cart.total >= 50 ? 0 : 5.99) + (cart.total * 0.08),
      };
      
      // Call API to create order
      const newOrder = await createOrder(orderData);
      
      // Clear cart
      await clear();
      
      // Redirect to order confirmation
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${newOrder._id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    } finally {
      setPlacingOrder(false);
    }
  };
  
  // Calculate Order Summary
  const subtotal = cart.total || 0;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // If cart is loading, show skeleton
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center relative ${formStep >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${formStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Shipping</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${formStep >= 2 ? 'bg-primary-600 dark:bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`flex items-center relative ${formStep >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${formStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${formStep >= 3 ? 'bg-primary-600 dark:bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`flex items-center relative ${formStep >= 3 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${formStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="md:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Step 1: Shipping Information */}
              {formStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="shippingAddress.fullName"
                        value={formData.shippingAddress.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors['shippingAddress.fullName'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['shippingAddress.fullName']}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="shippingAddress.address"
                        value={formData.shippingAddress.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors['shippingAddress.address'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['shippingAddress.address']}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="shippingAddress.city"
                          value={formData.shippingAddress.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors['shippingAddress.city'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['shippingAddress.city']}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="shippingAddress.postalCode"
                          value={formData.shippingAddress.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors['shippingAddress.postalCode'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['shippingAddress.postalCode']}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="shippingAddress.country"
                          value={formData.shippingAddress.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          {/* Add more countries as needed */}
                        </select>
                        {errors['shippingAddress.country'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['shippingAddress.country']}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="shippingAddress.phone"
                          value={formData.shippingAddress.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors['shippingAddress.phone'] && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['shippingAddress.phone']}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {formStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Payment Method
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="credit_card"
                              checked={formData.paymentMethod === 'credit_card'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Credit/Debit Card</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="paypal"
                              checked={formData.paymentMethod === 'paypal'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">PayPal</span>
                          </label>
                        </div>
                      </div>

                      {formData.paymentMethod === 'credit_card' && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardDetails.cardNumber"
                              value={formData.cardDetails.cardNumber}
                              onChange={handleChange}
                              placeholder="XXXX XXXX XXXX XXXX"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors['cardDetails.cardNumber'] && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['cardDetails.cardNumber']}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Expiration Date
                              </label>
                              <input
                                type="text"
                                id="expirationDate"
                                name="cardDetails.expirationDate"
                                value={formData.cardDetails.expirationDate}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              {errors['cardDetails.expirationDate'] && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['cardDetails.expirationDate']}</p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                name="cardDetails.cvv"
                                value={formData.cardDetails.cvv}
                                onChange={handleChange}
                                placeholder="XXX"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              {errors['cardDetails.cvv'] && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['cardDetails.cvv']}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              id="nameOnCard"
                              name="cardDetails.nameOnCard"
                              value={formData.cardDetails.nameOnCard}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors['cardDetails.nameOnCard'] && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['cardDetails.nameOnCard']}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === 'paypal' && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            You will be redirected to PayPal to complete your payment.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {formStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Review Your Order
                  </h2>

                  <div className="space-y-6">
                    {/* Shipping Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Shipping Information
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-gray-700 dark:text-gray-300">
                          {formData.shippingAddress.fullName}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {formData.shippingAddress.address}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {formData.shippingAddress.city}, {formData.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {formData.shippingAddress.country}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Phone: {formData.shippingAddress.phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Payment Method
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        {formData.paymentMethod === 'credit_card' ? (
                          <div>
                            <p className="text-gray-700 dark:text-gray-300">
                              Credit/Debit Card
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              Card ending in {formData.cardDetails.cardNumber.slice(-4)}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              Expires {formData.cardDetails.expirationDate}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">PayPal</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Order Items
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <div className="divide-y divide-gray-200 dark:divide-gray-600">
                          {cart.items.map((item) => (
                            <div key={item.product._id} className="py-4 flex items-center">
                              <img
                                src={item.product.images && item.product.images.length > 0 
                                  ? item.product.images[0] 
                                  : '/assets/images/default-product.jpg'}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="ml-4 flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(
                                  item.quantity * 
                                  (item.product.discount > 0 
                                    ? item.product.price * (1 - item.product.discount / 100) 
                                    : item.product.price)
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain spacing
                )}

                {formStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(tax)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  By placing your order, you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;