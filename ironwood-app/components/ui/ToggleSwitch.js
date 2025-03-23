import React from 'react';

export default function ToggleSwitch({
  isOn,
  handleToggle,
  label = null,
  id,
  disabled = false,
  size = 'medium',
  className = '',
  ...props
}) {
  const sizeClasses = {
    small: {
      switch: 'w-8 h-4',
      slider: 'h-4 w-4',
      translate: 'translate-x-4',
      text: 'text-xs'
    },
    medium: {
      switch: 'w-10 h-5',
      slider: 'h-5 w-5', 
      translate: 'translate-x-5',
      text: 'text-sm'
    },
    large: {
      switch: 'w-12 h-6',
      slider: 'h-6 w-6',
      translate: 'translate-x-6',
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];
  
  return (
    <div className={`flex items-center ${className}`} {...props}>
      {label && (
        <label 
          htmlFor={id}
          className={`mr-2 ${currentSize.text} ${disabled ? 'text-stellar-gray' : 'text-clinical-white'}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={isOn}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`${currentSize.switch} ${
            isOn ? 'bg-soft-mint' : 'bg-cosmic-ink'
          } rounded-full transition-colors duration-200 ease-in-out ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={!disabled ? handleToggle : undefined}
        >
          <div
            className={`${currentSize.slider} bg-clinical-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              isOn ? currentSize.translate : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
} 