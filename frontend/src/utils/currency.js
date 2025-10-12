/**
 * Currency utility functions for PKR formatting
 */

// Format amount in PKR
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'PKR 0';
  }
  
  const numAmount = Number(amount);
  return `PKR ${numAmount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

// Format amount with decimals if needed
export const formatCurrencyWithDecimals = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'PKR 0.00';
  }
  
  const numAmount = Number(amount);
  return `PKR ${numAmount.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Get currency symbol
export const getCurrencySymbol = () => 'PKR';

// Note: All amounts are handled directly in PKR - no conversion needed

// Validate PKR amount (reasonable range for consultation fees)
export const validateConsultationFee = (amount) => {
  const numAmount = Number(amount);
  
  if (isNaN(numAmount) || numAmount < 0) {
    return { isValid: false, message: 'Please enter a valid amount' };
  }
  
  if (numAmount < 500) {
    return { isValid: false, message: 'Minimum consultation fee is PKR 500' };
  }
  
  if (numAmount > 5000) {
    return { isValid: false, message: 'Maximum consultation fee is PKR 5,000' };
  }
  
  return { isValid: true, message: '' };
};

// Parse currency string to number
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove PKR, commas, and spaces, then parse (PKR only)
  const cleanString = currencyString.toString()
    .replace(/PKR|,|\s/g, '');
  
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};