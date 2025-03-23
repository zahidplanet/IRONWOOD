import React from 'react';

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  ...props
}) {
  return (
    <div className={`border-b border-cosmic-ink ${className}`} {...props}>
      <nav className="-mb-px flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200
              ${
                activeTab === tab.id
                  ? 'border-soft-mint text-soft-mint'
                  : 'border-transparent text-stellar-gray hover:text-clinical-white hover:border-cosmic-ink'
              }
            `}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs 
                ${activeTab === tab.id 
                  ? 'bg-soft-mint bg-opacity-20 text-soft-mint' 
                  : 'bg-cosmic-ink text-stellar-gray'}`
              }>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
} 