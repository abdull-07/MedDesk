import { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Weak',
    color: 'bg-red-500',
    width: '25%'
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: 'Weak',
        color: 'bg-red-500',
        width: '25%'
      });
      return;
    }

    // Calculate password strength
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char

    // Set strength based on score
    let strengthInfo = {
      score: score,
      label: 'Weak',
      color: 'bg-red-500',
      width: '25%'
    };

    if (score >= 3 && score < 5) {
      strengthInfo = {
        score: score,
        label: 'Moderate',
        color: 'bg-yellow-500',
        width: '50%'
      };
    } else if (score >= 5 && score < 6) {
      strengthInfo = {
        score: score,
        label: 'Strong',
        color: 'bg-blue-500',
        width: '75%'
      };
    } else if (score >= 6) {
      strengthInfo = {
        score: score,
        label: 'Very Strong',
        color: 'bg-green-500',
        width: '100%'
      };
    }

    setStrength(strengthInfo);
  }, [password]);

  return (
    <div className="mt-1">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strength.color} transition-all duration-300 ease-in-out`} 
          style={{ width: strength.width }}
        ></div>
      </div>
      <p className={`text-xs mt-1 ${password ? '' : 'opacity-0'}`}>
        Password strength: <span className="font-medium">{strength.label}</span>
      </p>
      {strength.score < 3 && password && (
        <ul className="text-xs text-gray-600 mt-1 list-disc pl-4">
          <li>At least 8 characters</li>
          {!/[A-Z]/.test(password) && <li>Include uppercase letters</li>}
          {!/[a-z]/.test(password) && <li>Include lowercase letters</li>}
          {!/[0-9]/.test(password) && <li>Include numbers</li>}
          {!/[^A-Za-z0-9]/.test(password) && <li>Include special characters</li>}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;