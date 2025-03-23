
import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(to right, #0070f3, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        IRONWOOD
      </h1>
      <p>Healthcare Dashboard System</p>
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        maxWidth: '500px'
      }}>
        <p>Next.js is running successfully!</p>
        <p>Status: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>ONLINE</span></p>
      </div>
    </div>
  );
}
