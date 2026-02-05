'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { voiceService, type Voice } from '@/lib/tts';
import { FaTrash, FaGlobe, FaLock } from 'react-icons/fa';
import styles from './voices.module.css';

export default function Voices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'en',
    is_public: false,
    file: null as File | null,
  });

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    setLoading(true);
    try {
      const data = await voiceService.getVoices();
      setVoices(data);
    } catch (err: any) {
      setError('Failed to load voices');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.file) {
      setError('Please select an audio file');
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('language', formData.language);
    data.append('is_public', formData.is_public.toString());
    data.append('file', formData.file);

    try {
      await voiceService.uploadVoice(data);
      setSuccess('Voice uploaded successfully!');
      setFormData({
        name: '',
        description: '',
        language: 'en',
        is_public: false,
        file: null,
      });
      loadVoices();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload voice');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (voiceId: number) => {
    if (!confirm('Are you sure you want to delete this voice?')) return;

    try {
      await voiceService.deleteVoice(voiceId);
      setSuccess('Voice deleted successfully');
      loadVoices();
    } catch (err: any) {
      setError('Failed to delete voice');
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>Voice Cloning</h1>

        <div className={styles.grid}>
          <div className="card">
            <h2>Upload Voice</h2>
            <p className={styles.info}>
              Upload a clean audio recording (1-5 minutes) of the voice you want to clone.
              Supported formats: WAV, MP3, M4A, FLAC
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Voice Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this voice..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  className="select"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>

              <div className="form-group">
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  />
                  <span>Make this voice public</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Audio File *</label>
                <input
                  type="file"
                  accept=".wav,.mp3,.m4a,.flac"
                  onChange={handleFileChange}
                  className="input"
                  required
                />
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Voice'}
              </button>
            </form>
          </div>

          <div>
            <div className="card">
              <h2>My Voices</h2>
              {loading ? (
                <div className="loading">Loading voices...</div>
              ) : voices.length === 0 ? (
                <p className={styles.empty}>No voices yet. Upload your first voice!</p>
              ) : (
                <div className={styles.voiceList}>
                  {voices.map((voice) => (
                    <div key={voice.id} className={styles.voiceItem}>
                      <div className={styles.voiceInfo}>
                        <h3>{voice.name}</h3>
                        {voice.description && <p>{voice.description}</p>}
                        <div className={styles.voiceMeta}>
                          <span>{voice.language.toUpperCase()}</span>
                          {voice.duration && <span>{voice.duration.toFixed(1)}s</span>}
                          {voice.is_public ? (
                            <span className={styles.public}>
                              <FaGlobe /> Public
                            </span>
                          ) : (
                            <span className={styles.private}>
                              <FaLock /> Private
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(voice.id)}
                        className={`btn btn-danger ${styles.deleteBtn}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
