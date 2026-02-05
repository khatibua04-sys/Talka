import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to Talka</h1>
        <p className={styles.subtitle}>
          Self-hosted Text-to-Speech platform with voice cloning
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>🎙️ Voice Cloning</h3>
            <p>Upload your voice samples and create custom voices</p>
          </div>
          <div className={styles.feature}>
            <h3>🌍 Multi-Language</h3>
            <p>Support for English and Swahili</p>
          </div>
          <div className={styles.feature}>
            <h3>⚙️ Full Control</h3>
            <p>Adjust speed, pitch, and output format</p>
          </div>
          <div className={styles.feature}>
            <h3>💾 Download & Play</h3>
            <p>Get your audio in MP3 or WAV format</p>
          </div>
        </div>
        <div className={styles.cta}>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
