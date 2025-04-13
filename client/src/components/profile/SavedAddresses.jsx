import React, { useState } from "react";
import { FiPlusCircle, FiTrash2, FiEdit } from "react-icons/fi";

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      street: "456 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
      isDefault: false,
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingAddressId(null);
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
    });
  };

  const handleEditClick = (address) => {
    setIsAddingNew(false);
    setEditingAddressId(address.id);
    setFormData({ ...address });
  };

  const handleDeleteClick = (addressId) => {
    setAddresses(addresses.filter((address) => address.id !== addressId));
  };

  const handleSetAsDefault = (addressId) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isAddingNew) {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now(), // Simple ID generation
      };
      
      // If setting new address as default, update all others
      if (newAddress.isDefault) {
        setAddresses(
          addresses.map((address) => ({
            ...address,
            isDefault: false,
          }))
        );
      }
      
      setAddresses([...addresses, newAddress]);
    } else if (editingAddressId) {
      // Update existing address
      const updatedAddresses = addresses.map((address) => {
        if (address.id === editingAddressId) {
          return { ...formData };
        }
        
        // If setting this address as default, remove default from all others
        if (formData.isDefault && address.id !== editingAddressId) {
          return { ...address, isDefault: false };
        }
        
        return address;
      });
      
      setAddresses(updatedAddresses);
    }
    
    // Reset form state
    setIsAddingNew(false);
    setEditingAddressId(null);
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingAddressId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Saved Addresses</h2>
        <button
          onClick={handleAddNewClick}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiPlusCircle className="h-5 w-5 mr-1" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Form */}
      {(isAddingNew || editingAddressId) && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">
            {isAddingNew ? "Add New Address" : "Edit Address"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Address Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                placeholder="Home, Work, etc."
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Set as default address</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isAddingNew ? "Add Address" : "Update Address"}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500 italic">No addresses saved yet.</p>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-md p-4 ${
                address.isDefault ? "border-indigo-300 bg-indigo-50" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{address.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{address.street}</p>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-600 text-sm">{address.country}</p>
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-gray-600 hover:text-indigo-600"
                    aria-label="Edit address"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address.id)}
                    className="text-gray-600 hover:text-red-600"
                    aria-label="Delete address"
                    disabled={address.isDefault}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetAsDefault(address.id)}
                  className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Set as default
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;