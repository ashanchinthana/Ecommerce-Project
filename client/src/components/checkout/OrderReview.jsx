// src/components/checkout/OrderReview.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderReview = ({ 
  shippingDetails, 
  paymentDetails, 
  shippingMethod, 
  cartItems, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  onBack, 
  onPlaceOrder, 
  processing 
}) => {
  // Format the last 4 digits of the credit card
  const lastFourDigits = paymentDetails.cardNumber 
    ? paymentDetails.cardNumber.replace(/\s/g, '').slice(-4) 
    : '';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Review Your Order</h2>
      
      <div className="space-y-6">
        {/* Shipping Information */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-md font-medium dark:text-white">Shipping Information</h3>
            <button 
              onClick={() => onBack()}
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Edit
            </button>
          </div>
          
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>{shippingDetails.fullName}</p>
            <p>{shippingDetails.address}</p>
            <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}</p>
            <p>{shippingDetails.country}</p>
            <p>Phone: {shippingDetails.phoneNumber}</p>
            <p className="mt-2">
              <span className="font-medium">Shipping Method: </span>
              {shippingMethod === 'express' ? 'Express Shipping (1-2 business days)' : 'Standard Shipping (3-5 business days)'}
            </p>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-md font-medium dark:text-white">Payment Information</h3>
            <button 
              onClick={() => onBack()}
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Edit
            </button>
          </div>
          
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>Credit Card ending in {lastFourDigits}</p>
            <p>{paymentDetails.nameOnCard}</p>
            <p>Expires: {paymentDetails.expiryDate}</p>
          </div>
        </div>
        
        {/* Order Items */}
        <div>
          <h3 className="text-md font-medium mb-3 dark:text-white">Order Items</h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-600">
            {cartItems.map(item => (
              <div key={item.id} className="flex py-4 px-4">
                <div className="h-16 w-16 flex-shrink-0 bg-gray-100 dark:bg-gray-600 rounded overflow-hidden mr-4">
                  <img 
                    src={item.images && item.images.length > 0 ? item.images[0] : '/api/placeholder/80/80'}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium dark:text-white">{item.name}</h4>
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
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <h3 className="text-md font-medium mb-3 dark:text-white">Order Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="dark:text-white">
                {shipping === 0 ? 'Free' : formatCurrency(shipping)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="dark:text-white">{formatCurrency(tax)}</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p>
          By placing this order, you agree to our <a href="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">Terms of Service</a> and acknowledge our <a href="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">Privacy Policy</a>.
        </p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Back to Payment
        </button>
        
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={processing}
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;