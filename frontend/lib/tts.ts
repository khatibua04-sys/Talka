import api from './api';

export interface Voice {
  id: number;
  name: string;
  description?: string;
  audio_path: string;
  duration?: number;
  language: string;
  user_id: number;
  created_at: string;
  is_public: boolean;
}

export interface TTSRequest {
  text: string;
  voice_id?: number;
  speed: number;
  pitch: number;
  language: string;
  output_format: string;
}

export interface TTSResponse {
  output_path: string;
  duration?: number;
  history_id: number;
}

export interface TTSHistoryItem {
  id: number;
  text: string;
  voice_id?: number;
  speed: number;
  pitch: number;
  output_path?: string;
  language: string;
  created_at: string;
}

export const ttsService = {
  async generateSpeech(request: TTSRequest): Promise<TTSResponse> {
    const response = await api.post('/api/tts/generate', request);
    return response.data;
  },

  async getHistory(skip: number = 0, limit: number = 50): Promise<TTSHistoryItem[]> {
    const response = await api.get('/api/tts/history', {
      params: { skip, limit },
    });
    return response.data;
  },

  async deleteHistory(historyId: number): Promise<void> {
    await api.delete(`/api/tts/history/${historyId}`);
  },

  getDownloadUrl(filename: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${filename}`;
  },
};

export const voiceService = {
  async uploadVoice(formData: FormData): Promise<Voice> {
    const response = await api.post('/api/voices/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getVoices(): Promise<Voice[]> {
    const response = await api.get('/api/voices/');
    return response.data;
  },

  async getVoice(voiceId: number): Promise<Voice> {
    const response = await api.get(`/api/voices/${voiceId}`);
    return response.data;
  },

  async deleteVoice(voiceId: number): Promise<void> {
    await api.delete(`/api/voices/${voiceId}`);
  },
};
