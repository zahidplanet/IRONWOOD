import React from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>IRONWOOD</span>
        </h1>
        <p className={styles.description}>
          Healthcare Dashboard System
        </p>
        
        <div className={styles.statusCard}>
          <p>Status: <span className={styles.online}>ONLINE</span></p>
          <p>Next.js + Electron successfully connected!</p>
        </div>
      </main>
    </div>
  );
}