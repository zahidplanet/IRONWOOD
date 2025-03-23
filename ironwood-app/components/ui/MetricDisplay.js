import React from 'react';

export default function MetricDisplay({ 
  title, 
  value, 
  change = null, 
  prefix = '', 
  suffix = '', 
  className = '',
  trend = null, // 'up', 'down', 'neutral'
  ...props 
}) {
  let trendColor = '';
  let trendIcon = null;
  
  if (trend === 'up') {
    trendColor = 'text-soft-mint';
    trendIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
    );
  } else if (trend === 'down') {
    trendColor = 'text-electric-coral';
    trendIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586 19.293 6.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L11 8.414l-3.293 3.293A1 1 0 017 12H5a1 1 0 110-2h2.586l4.293-4.293a1 1 0 111.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 12.586V13z" clipRule="evenodd" />
      </svg>
    );
  }
  
  return (
    <div className={`flex flex-col ${className}`} {...props}>
      <div className="text-stellar-gray text-small mb-1">{title}</div>
      <div className="text-h3 font-numeric font-semibold text-clinical-white">
        {prefix}{value}{suffix}
      </div>
      {change !== null && (
        <div className={`flex items-center mt-1 text-small ${trendColor}`}>
          {trendIcon}
          <span className="ml-1">{change > 0 ? '+' : ''}{change}%</span>
        </div>
      )}
    </div>
  );
} 