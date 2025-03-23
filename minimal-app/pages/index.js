import React from 'react';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#121212',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{
        background: 'linear-gradient(to right, #0070f3, #8a2be2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '3rem',
        marginBottom: '1rem'
      }}>
        IRONWOOD
      </h1>
      <p style={{
        fontSize: '1.5rem',
        marginBottom: '2rem'
      }}>
        Healthcare Dashboard System
      </p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <p>Next.js + Electron running successfully!</p>
        <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Status: ONLINE</p>
      </div>
    </div>
  );
}