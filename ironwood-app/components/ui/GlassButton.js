import React from 'react';

export default function GlassButton({ 
  children, 
  className = '',
  variant = 'primary', // 'primary', 'secondary', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  ...props 
}) {
  const baseClasses = 'font-medium transition-all duration-200 rounded-xl flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-medical-teal/80 hover:bg-medical-teal text-clinical-white',
    secondary: 'bg-neon-purple/70 hover:bg-neon-purple text-clinical-white',
    danger: 'bg-electric-coral/70 hover:bg-electric-coral text-clinical-white',
    outline: 'bg-transparent border border-clinical-white/20 hover:border-clinical-white/50 text-clinical-white',
  };
  
  const sizeClasses = {
    sm: 'text-small py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-h4 py-3 px-6',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 