'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ttsService, voiceService, type Voice } from '@/lib/tts';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number | undefined>();
  const [language, setLanguage] = useState('en');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const data = await voiceService.getVoices();
      setVoices(data);
    } catch (err) {
      console.error('Failed to load voices:', err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAudioUrl(null);
    setLoading(true);

    try {
      const response = await ttsService.generateSpeech({
        text,
        voice_id: selectedVoice,
        speed,
        pitch,
        language,
        output_format: outputFormat,
      });

      setSuccess('Speech generated successfully!');
      setAudioUrl(ttsService.getDownloadUrl(response.output_path));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate speech');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>Text-to-Speech Dashboard</h1>
        
        <div className={styles.grid}>
          <div className={styles.leftPanel}>
            <div className="card">
              <h2>Generate Speech</h2>
              <form onSubmit={handleGenerate}>
                <div className="form-group">
                  <label className="form-label">Text</label>
                  <textarea
                    className="textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    required
                    maxLength={5000}
                  />
                  <small>{text.length}/5000 characters</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Voice</label>
                  <select
                    className="select"
                    value={selectedVoice || ''}
                    onChange={(e) => setSelectedVoice(e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <option value="">Default Voice</option>
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} ({voice.language})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    className="select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Speed: {speed.toFixed(1)}x</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pitch: {pitch.toFixed(1)}x</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Output Format</label>
                  <select
                    className="select"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                  </select>
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading || !text}>
                  {loading ? 'Generating...' : 'Generate Speech'}
                </button>
              </form>
            </div>
          </div>

          <div className={styles.rightPanel}>
            {audioUrl && (
              <div className="card">
                <h2>Generated Audio</h2>
                <audio controls className={styles.audio} src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
                <a
                  href={audioUrl}
                  download
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}
                >
                  Download Audio
                </a>
              </div>
            )}

            <div className="card">
              <h2>Quick Tips</h2>
              <ul className={styles.tips}>
                <li>📝 Enter up to 5000 characters</li>
                <li>🎤 Upload custom voices in the Voices tab</li>
                <li>⚡ Adjust speed and pitch for different effects</li>
                <li>🌍 Switch between English and Swahili</li>
                <li>💾 Download in MP3 or WAV format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
