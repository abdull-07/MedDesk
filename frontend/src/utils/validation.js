/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least 3 of the following: uppercase, lowercase, number, special char
  let score = 0;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 3) {
    return { 
      isValid: false, 
      message: 'Password must contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and special characters' 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates a name
 * @param {string} name - The name to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  // Check if name contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Name contains invalid characters' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true, message: '' }; // Phone might be optional
  }
  
  // Allow digits, spaces, dashes, parentheses, and plus sign
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,10}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Creates a form field validator
 * @param {string} value - The field value
 * @param {Array} validations - Array of validation functions
 * @returns {Object} - Validation result with isValid and message
 */
export const validateField = (value, validations) => {
  for (const validate of validations) {
    const result = validate(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, message: '' };
};