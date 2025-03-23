import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Navigation() {
  const router = useRouter();
  
  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <Link href="/" className={styles.navLink}>
          <span className={styles.gradient}>IRONWOOD</span>
        </Link>
      </div>
      
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={styles.navLink}
        >
          Dashboard
        </Link>
        <Link 
          href="/portfolio" 
          className={styles.navLink}
        >
          AI Portfolio
        </Link>
      </div>
    </nav>
  );
}