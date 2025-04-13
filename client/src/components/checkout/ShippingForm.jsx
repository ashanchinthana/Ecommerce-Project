// src/components/checkout/ShippingForm.jsx
import React, { useState } from 'react';

const ShippingForm = ({ data, shippingMethod, onChange, onShippingMethodChange, onSubmit }) => {
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
    
    if (!data.fullName) newErrors.fullName = 'Full name is required';
    if (!data.email) newErrors.email = 'Email is required';
    if (!data.address) newErrors.address = 'Address is required';
    if (!data.city) newErrors.city = 'City is required';
    if (!data.state) newErrors.state = 'State is required';
    if (!data.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!data.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    
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
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Shipping Information</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Street Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={data.address}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={data.city}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State / Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={data.state}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.state && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state}</p>}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ZIP / Postal Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={data.zipCode}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zipCode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.zipCode}</p>}
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={data.country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>}
        </div>
      </div>
      
      {/* Shipping Methods */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 dark:text-white">Shipping Method</h3>
        
        <div className="space-y-4">
          <label className="flex border rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={shippingMethod === 'standard'}
              onChange={() => onShippingMethodChange('standard')}
              className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <div className="ml-3 flex-grow">
              <span className="block text-sm font-medium dark:text-white">Standard Shipping</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Free for orders over $50, otherwise $5.99
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Delivery in 3-5 business days
              </span>
            </div>
            <div className="text-sm font-medium dark:text-white">
              {data.subtotal >= 50 ? 'Free' : '$5.99'}
            </div>
          </label>
          
          <label className="flex border rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
            <input
              type="radio"
              name="shippingMethod"
              value="express"
              checked={shippingMethod === 'express'}
              onChange={() => onShippingMethodChange('express')}
              className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <div className="ml-3 flex-grow">
              <span className="block text-sm font-medium dark:text-white">Express Shipping</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Faster delivery for your order
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Delivery in 1-2 business days
              </span>
            </div>
            <div className="text-sm font-medium dark:text-white">$15.99</div>
          </label>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;