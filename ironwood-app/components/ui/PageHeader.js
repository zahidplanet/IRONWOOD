import React from 'react';

export default function PageHeader({ 
  title, 
  subtitle = null, 
  actions = null,
  className = '',
  ...props 
}) {
  return (
    <div className={`flex justify-between items-center py-4 mb-6 ${className}`} {...props}>
      <div>
        <h1 className="text-h1 font-bold text-clinical-white">{title}</h1>
        {subtitle && <p className="text-stellar-gray mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
} 