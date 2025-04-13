// src/components/checkout/PaymentForm.jsx
import React, { useState } from 'react';

const PaymentForm = ({ data, onChange, onBack, onSubmit }) => {
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number (16 digits, spaces allowed)
    if (!data.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Validate name on card
    if (!data.nameOnCard) {
      newErrors.nameOnCard = 'Name on card is required';
    }
    
    // Validate expiry date (MM/YY format)
    if (!data.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    
    // Validate CVV (3-4 digits)
    if (!data.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(data.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Payment Information</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <input
              id="card"
              name="paymentType"
              type="radio"
              checked
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label htmlFor="card" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Credit / Debit Card
            </label>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={data.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cardNumber}</p>}
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                id="nameOnCard"
                name="nameOnCard"
                value={data.nameOnCard}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.nameOnCard ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nameOnCard && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nameOnCard}</p>}
            </div>
            
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={data.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>}
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={data.cvv}
                onChange={handleChange}
                placeholder="123"
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cvv && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Back to Shipping
        </button>
        
        <button
          type="submit"
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Review Order
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;