'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ttsService, type TTSHistoryItem } from '@/lib/tts';
import { FaTrash, FaDownload } from 'react-icons/fa';
import styles from './history.module.css';

export default function History() {
  const [history, setHistory] = useState<TTSHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await ttsService.getHistory();
      setHistory(data);
    } catch (err: any) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (historyId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await ttsService.deleteHistory(historyId);
      loadHistory();
    } catch (err: any) {
      setError('Failed to delete history item');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>Generation History</h1>

        <div className="card">
          {loading ? (
            <div className="loading">Loading history...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : history.length === 0 ? (
            <p className={styles.empty}>No history yet. Generate your first speech!</p>
          ) : (
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <div className={styles.text}>
                      {item.text.length > 100
                        ? `${item.text.substring(0, 100)}...`
                        : item.text}
                    </div>
                    <div className={styles.meta}>
                      <span>{formatDate(item.created_at)}</span>
                      <span>{item.language.toUpperCase()}</span>
                      <span>Speed: {item.speed}x</span>
                      <span>Pitch: {item.pitch}x</span>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    {item.output_path && (
                      <a
                        href={ttsService.getDownloadUrl(item.output_path)}
                        download
                        className="btn btn-secondary"
                      >
                        <FaDownload />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
