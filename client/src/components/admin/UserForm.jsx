import React, { useState, useEffect } from 'react';

const UserForm = ({ user = null, onSubmit, onCancel }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // If editing an existing user, populate the form
      setUserData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password for security
        role: user.role || 'customer',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation (only required for new users)
    if (!user && !userData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (userData.password && userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(userData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {user ? 'Password (Leave blank to keep current)' : 'Password'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          User Role
        </label>
        <select
          id="role"
          name="role"
          value={userData.role}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={userData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Active Account
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;