import React, { useState } from "react";
import { FiPlusCircle, FiTrash2, FiEdit, FiCreditCard, FiHome } from "react-icons/fi";

const PaymentMethods = () => {
  // Sample payment methods data
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "credit_card",
      name: "Personal Visa",
      cardNumber: "•••• •••• •••• 4242",
      expiryDate: "09/26",
      isDefault: true,
      cardType: "visa",
    },
    {
      id: 2,
      type: "credit_card",
      name: "Work Mastercard",
      cardNumber: "•••• •••• •••• 5555",
      expiryDate: "12/25",
      isDefault: false,
      cardType: "mastercard",
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [activeTab, setActiveTab] = useState("credit_card"); // credit_card or bank_account
  
  // Form state
  const [formData, setFormData] = useState({
    type: "credit_card",
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    bankName: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For card number, add spaces every 4 characters for better readability
    if (name === "cardNumber") {
      const sanitizedValue = value.replace(/\s/g, "").replace(/\D/g, "").slice(0, 16);
      // Format with spaces every 4 digits
      const formattedValue = sanitizedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // For expiry date, format as MM/YY
    if (name === "expiryDate") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
      if (sanitizedValue.length > 2) {
        const formattedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(2)}`;
        setFormData({ ...formData, [name]: formattedValue });
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
      }
      return;
    }
    
    // For CVV, limit to 3-4 digits
    if (name === "cvv") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
      setFormData({ ...formData, [name]: sanitizedValue });
      return;
    }
    
    // For other fields, handle normally
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to determine card type from number
  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover";
    return "unknown";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create payment method object based on type
    let newPaymentMethod = {
      id: editingMethodId || Date.now(),
      type: activeTab,
      isDefault: formData.isDefault,
    };
    
    if (activeTab === "credit_card") {
      newPaymentMethod = {
        ...newPaymentMethod,
        name: formData.name,
        cardNumber: formData.cardNumber.replace(/\d(?=\d{4})/g, "•"),
        expiryDate: formData.expiryDate,
        cardType: detectCardType(formData.cardNumber),
      };
    } else if (activeTab === "bank_account") {
      newPaymentMethod = {
        ...newPaymentMethod,
        name: formData.name,
        accountNumber: `••••${formData.accountNumber.slice(-4)}`,
        routingNumber: `••••${formData.routingNumber.slice(-4)}`,
        bankName: formData.bankName,
      };
    }
    
    // Update payment methods
    if (editingMethodId) {
      // Update existing method
      setPaymentMethods(
        paymentMethods.map((method) => {
          if (method.id === editingMethodId) {
            return newPaymentMethod;
          }
          
          // If setting a new default, remove default from others
          if (newPaymentMethod.isDefault && method.id !== editingMethodId) {
            return { ...method, isDefault: false };
          }
          
          return method;
        })
      );
    } else {
      // Add new method
      // If setting as default, update other methods
      if (newPaymentMethod.isDefault) {
        setPaymentMethods(
          paymentMethods.map((method) => ({
            ...method,
            isDefault: false,
          }))
        );
      }
      
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
    }
    
    // Reset form
    resetForm();
  };

  // Handle adding new payment method
  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingMethodId(null);
    resetForm();
  };

  // Handle editing existing payment method
  const handleEditClick = (method) => {
    setIsAddingNew(false);
    setEditingMethodId(method.id);
    setActiveTab(method.type);
    
    // Set form data based on payment method type
    if (method.type === "credit_card") {
      setFormData({
        ...formData,
        type: method.type,
        name: method.name,
        cardNumber: method.cardNumber, // Note: This would typically come from API with masked digits
        expiryDate: method.expiryDate,
        isDefault: method.isDefault,
      });
    } else if (method.type === "bank_account") {
      setFormData({
        ...formData,
        type: method.type,
        name: method.name,
        bankName: method.bankName,
        accountNumber: method.accountNumber, // Would typically be masked except last 4
        routingNumber: method.routingNumber, // Would typically be masked except last 4
        isDefault: method.isDefault,
      });
    }
  };

  // Handle deleting payment method
  const handleDeleteClick = (methodId) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== methodId));
  };

  // Handle setting default payment method
  const handleSetAsDefault = (methodId) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  // Reset form state
  const resetForm = () => {
    setIsAddingNew(false);
    setEditingMethodId(null);
    setFormData({
      type: activeTab,
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      isDefault: false,
      accountNumber: "",
      routingNumber: "",
      accountHolderName: "",
      bankName: "",
    });
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
  };

  // Get card logo based on type
  const getCardLogo = (cardType) => {
    // In a real application, you'd use actual card logos
    switch (cardType) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "Amex";
      case "discover":
        return "Discover";
      default:
        return "Card";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
        <button
          onClick={handleAddNewClick}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiPlusCircle className="h-5 w-5 mr-1" />
          <span>Add New Payment Method</span>
        </button>
      </div>

      {/* Payment Method Form */}
      {(isAddingNew || editingMethodId) && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">
            {isAddingNew ? "Add New Payment Method" : "Edit Payment Method"}
          </h3>
          
          {/* Payment Type Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              type="button"
              className={`py-2 px-4 focus:outline-none ${
                activeTab === "credit_card"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("credit_card")}
            >
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 mr-1" />
                <span>Credit Card</span>
              </div>
            </button>
            <button
              type="button"
              className={`py-2 px-4 focus:outline-none ${
                activeTab === "bank_account"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("bank_account")}
            >
              <div className="flex items-center">
                <FiHome className="h-5 w-5 mr-1" />
                <span>Bank Account</span>
              </div>
            </button>
          </div>
          
          {/* Credit Card Form */}
          {activeTab === "credit_card" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Bank Account Form */}
          {activeTab === "bank_account" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="Bank of America"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="Checking Account"
                  />
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    id="routingNumber"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="987654321"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Set as default payment method</span>
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
              {isAddingNew ? "Add Payment Method" : "Update Payment Method"}
            </button>
          </div>
        </form>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <p className="text-gray-500 italic">No payment methods saved yet.</p>
        ) : (
          paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-md p-4 ${
                method.isDefault ? "border-indigo-300 bg-indigo-50" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  {method.type === "credit_card" ? (
                    <div className="mr-3 text-sm font-semibold bg-gray-100 rounded px-2 py-1">
                      {getCardLogo(method.cardType)}
                    </div>
                  ) : (
                    <FiHome className="h-6 w-6 mr-3 text-gray-700" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    {method.type === "credit_card" ? (
                      <p className="text-gray-600 text-sm mt-1">
                        {method.cardNumber} • Expires {method.expiryDate}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm mt-1">
                        {method.bankName} • Account {method.accountNumber}
                      </p>
                    )}
                    {method.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(method)}
                    className="text-gray-600 hover:text-indigo-600"
                    aria-label="Edit payment method"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(method.id)}
                    className="text-gray-600 hover:text-red-600"
                    aria-label="Delete payment method"
                    disabled={method.isDefault}
                  >
                    <FiTrash2 className={`h-5 w-5 ${method.isDefault ? "opacity-30" : ""}`} />
                  </button>
                </div>
              </div>
              {!method.isDefault && (
                <button
                  onClick={() => handleSetAsDefault(method.id)}
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

export default PaymentMethods;