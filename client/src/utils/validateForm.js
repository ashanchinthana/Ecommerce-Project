/**
 * Common form validation rules
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least 1 letter and 1 number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Postal code validation (US)
export const isValidPostalCode = (postalCode) => {
  const postalCodeRegex = /^\d{5}(-\d{4})?$/;
  return postalCodeRegex.test(postalCode);
};

// Credit card validation
export const isValidCreditCard = (cardNumber) => {
  // Remove spaces and dashes
  const sanitizedCardNumber = cardNumber.replace(/[\s-]/g, '');
  // Check if contains only digits and has valid length (13-19 digits)
  return /^\d{13,19}$/.test(sanitizedCardNumber);
};