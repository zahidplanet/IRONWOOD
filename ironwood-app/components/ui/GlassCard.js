import React from 'react';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div 
      className={`glass-card p-md ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
} 