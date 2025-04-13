// src/utils/formatCurrency.js
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};