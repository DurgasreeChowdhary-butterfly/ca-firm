import React from 'react';

const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };
  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-blue-200 border-t-blue-700`} />
  );
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default LoadingSpinner;
