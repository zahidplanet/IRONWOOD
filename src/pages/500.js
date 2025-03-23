import React from 'react';

export default function Custom500() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>500 - Server Error</h1>
      <p>Sorry, an unexpected error occurred on the server.</p>
    </div>
  );
}