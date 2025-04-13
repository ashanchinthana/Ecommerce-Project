import React, { useState, useEffect } from 'react';
import { updateUser, createUser } from '../../api/userApi';
import { toast } from 'react-hot-toast';
import { XIcon } from '@heroicons/react/solid';
import { isValidEmail } from '../../utils/validateForm';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const initialState = {
    name: '',
    email: '',
    password: '',
    isAdmin: false,
  };

  const [formData, setFormData] = useState(initialState);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState('create');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        isAdmin: user.isAdmin || false,
      });
      setMode('edit');
    } else {
      setFormData(initialState);
      setMode('create');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      // In edit mode, password is optional but if provided must match confirm and be valid
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password && formData.password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = { ...formData };
      
      // Remove password if empty in edit mode
      if (mode === 'edit' && !userData.password) {
        delete userData.password;
      }
      
      if (mode === 'edit') {
        await updateUser(user._id, userData);
        toast.success('User updated successfully');
      } else {
        await createUser(userData);
        toast.success('User created successfully');
      }
      
      onSubmit(); // Notify parent component
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} user`
      );
      console.error(`${mode === 'edit' ? 'Update' : 'Create'} user error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'edit' ? 'Edit User' : 'Add New User'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password {mode === 'create' && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {mode === 'edit' && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Leave blank to keep current password
            </p>
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password {mode === 'create' && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Admin User
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;