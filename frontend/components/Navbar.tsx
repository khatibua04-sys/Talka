'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Talka
        </Link>
        
        <div className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className={pathname === '/dashboard' ? styles.active : ''}
              >
                Dashboard
              </Link>
              <Link 
                href="/voices" 
                className={pathname === '/voices' ? styles.active : ''}
              >
                Voices
              </Link>
              <Link 
                href="/history" 
                className={pathname === '/history' ? styles.active : ''}
              >
                History
              </Link>
              <span className={styles.user}>{user?.username}</span>
              <button onClick={handleLogout} className={styles.logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
