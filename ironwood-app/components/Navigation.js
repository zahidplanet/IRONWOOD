import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <Link href="/" legacyBehavior>
          <a className={styles.navLink}>
            <span className={styles.gradient}>IRONWOOD</span>
          </a>
        </Link>
      </div>
      
      <div className={styles.navLinks}>
        <Link href="/" legacyBehavior>
          <a className={styles.navLink}>Dashboard</a>
        </Link>
        <Link href="/portfolio" legacyBehavior>
          <a className={styles.navLink}>AI Portfolio</a>
        </Link>
      </div>
    </nav>
  );
}