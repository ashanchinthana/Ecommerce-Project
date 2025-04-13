// src/components/profile/ProfileInfo.jsx
import React, { useState } from 'react';

const ProfileInfo = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || ''
  });
  
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^\+?[\d\s-()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // In a real app, you would update the user profile via API here
    // For now, we'll just simulate success
    
    console.log('Updated profile:', formData);
    setEditing(false);
    
    // You would typically update the user context here after a successful API call
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Personal Information</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            Edit
          </button>
        ) : null}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-2 border rounded-md shadow-sm ${
                editing 
                  ? 'focus:ring-primary-500 focus:border-primary-500' 
                  : 'bg-gray-50 dark:bg-gray-700'
              } ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:text-white`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-2 border rounded-md shadow-sm ${
                editing 
                  ? 'focus:ring-primary-500 focus:border-primary-500' 
                  : 'bg-gray-50 dark:bg-gray-700'
              } ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:text-white`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-2 border rounded-md shadow-sm ${
                editing 
                  ? 'focus:ring-primary-500 focus:border-primary-500' 
                  : 'bg-gray-50 dark:bg-gray-700'
              } ${
                errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:text-white`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-2 border rounded-md shadow-sm ${
                editing 
                  ? 'focus:ring-primary-500 focus:border-primary-500' 
                  : 'bg-gray-50 dark:bg-gray-700'
              } border-gray-300 dark:border-gray-600 dark:text-white`}
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-2 border rounded-md shadow-sm ${
                editing 
                  ? 'focus:ring-primary-500 focus:border-primary-500' 
                  : 'bg-gray-50 dark:bg-gray-700'
              } border-gray-300 dark:border-gray-600 dark:text-white`}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Password Change would typically be on a separate page or modal */}
          {editing && (
            <div className="md:col-span-2">
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</h3>
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Change Password
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ••••••••
                </p>
              </div>
            </div>
          )}
        </div>
        
        {editing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInfo;