import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Chargement...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;