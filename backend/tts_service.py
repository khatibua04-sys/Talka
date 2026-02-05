import torch
import ChatTTS
import numpy as np
import soundfile as sf
from pydub import AudioSegment
import os
import librosa
import noisereduce as nr
from typing import Optional, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TTSService:
    def __init__(self):
        self.chat = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"TTS Service using device: {self.device}")
        
    def initialize(self):
        """Initialize ChatTTS model"""
        if self.chat is None:
            logger.info("Loading ChatTTS model...")
            self.chat = ChatTTS.Chat()
            self.chat.load(compile=False, device=self.device)
            logger.info("ChatTTS model loaded successfully")
    
    def generate_speech(
        self,
        text: str,
        output_path: str,
        speed: float = 1.0,
        pitch: float = 1.0,
        language: str = "en",
        voice_embedding: Optional[np.ndarray] = None,
        output_format: str = "mp3"
    ) -> Tuple[str, float]:
        """
        Generate speech from text
        
        Args:
            text: Input text to convert to speech
            output_path: Path to save the output audio
            speed: Speech speed multiplier (0.5 to 2.0)
            pitch: Pitch multiplier (0.5 to 2.0)
            language: Language code (en or sw)
            voice_embedding: Optional voice embedding for cloning
            output_format: Output format (mp3 or wav)
            
        Returns:
            Tuple of (output_path, duration)
        """
        self.initialize()
        
        # Prepare text based on language
        if language == "sw":
            # For Swahili, we might need to add language hints
            text_prompt = f"[Swahili] {text}"
        else:
            text_prompt = text
        
        # Generate audio
        params_infer_code = ChatTTS.Chat.InferCodeParams(
            temperature=0.3,
        )
        
        params_refine_text = ChatTTS.Chat.RefineTextParams(
            prompt='[oral_2][laugh_0][break_4]',
        )
        
        # Use custom voice embedding if provided
        if voice_embedding is not None:
            rand_spk = voice_embedding
        else:
            rand_spk = self.chat.sample_random_speaker()
        
        wavs = self.chat.infer(
            [text_prompt],
            params_refine_text=params_refine_text,
            params_infer_code=params_infer_code,
            spk_emb=rand_spk,
        )
        
        if not wavs or len(wavs) == 0:
            raise ValueError("Failed to generate audio")
        
        audio_data = wavs[0]
        
        # Apply speed and pitch adjustments
        audio_data = self._adjust_audio(audio_data, speed, pitch)
        
        # Save to temporary WAV file first
        temp_wav = output_path.replace(f".{output_format}", "_temp.wav")
        sample_rate = 24000  # ChatTTS default sample rate
        sf.write(temp_wav, audio_data, sample_rate)
        
        # Convert to desired format
        if output_format == "mp3":
            audio = AudioSegment.from_wav(temp_wav)
            audio.export(output_path, format="mp3", bitrate="192k")
            os.remove(temp_wav)
        else:
            os.rename(temp_wav, output_path)
        
        # Get duration
        duration = len(audio_data) / sample_rate
        
        return output_path, duration
    
    def _adjust_audio(self, audio_data: np.ndarray, speed: float, pitch: float) -> np.ndarray:
        """Adjust audio speed and pitch"""
        # Adjust speed using time stretching
        if speed != 1.0:
            audio_data = librosa.effects.time_stretch(audio_data, rate=speed)
        
        # Adjust pitch using pitch shifting
        if pitch != 1.0:
            # Convert pitch multiplier to semitones (12 semitones = octave)
            n_steps = 12 * np.log2(pitch)
            audio_data = librosa.effects.pitch_shift(
                audio_data, 
                sr=24000, 
                n_steps=n_steps
            )
        
        return audio_data
    
    def extract_voice_embedding(self, audio_path: str) -> np.ndarray:
        """
        Extract voice embedding from audio file for voice cloning
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Voice embedding array
        """
        self.initialize()
        
        # Load and preprocess audio
        audio_data, sample_rate = librosa.load(audio_path, sr=24000, mono=True)
        
        # Reduce noise
        audio_data = nr.reduce_noise(y=audio_data, sr=sample_rate)
        
        # Trim silence
        audio_data, _ = librosa.effects.trim(audio_data, top_db=20)
        
        # For voice cloning, we'll use ChatTTS's speaker embedding
        # In a real implementation, you would extract features from the audio
        # For now, we'll create a pseudo-embedding based on audio characteristics
        
        # Extract audio features
        mfcc = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=13)
        mfcc_mean = np.mean(mfcc, axis=1)
        
        # Create a voice embedding (this is simplified)
        # In production, you'd want a proper voice encoder model
        embedding = self.chat.sample_random_speaker()
        
        # Modify the embedding slightly based on audio characteristics
        # This is a simplified approach - real voice cloning would use a proper encoder
        modification = np.random.randn(*embedding.shape) * 0.1
        embedding = embedding + modification * (mfcc_mean.mean() / 100)
        
        return embedding
    
    def validate_audio_file(self, audio_path: str) -> Tuple[bool, str, float]:
        """
        Validate audio file for voice cloning
        
        Returns:
            Tuple of (is_valid, message, duration)
        """
        try:
            audio_data, sample_rate = librosa.load(audio_path, sr=None, mono=True)
            duration = len(audio_data) / sample_rate
            
            if duration < 60:
                return False, "Audio must be at least 60 seconds long", duration
            if duration > 300:
                return False, "Audio must be no longer than 300 seconds (5 minutes)", duration
            
            # Check for sufficient audio energy
            rms = librosa.feature.rms(y=audio_data)[0]
            if np.mean(rms) < 0.01:
                return False, "Audio is too quiet or contains mostly silence", duration
            
            return True, "Audio is valid", duration
            
        except Exception as e:
            return False, f"Error processing audio: {str(e)}", 0.0


# Global TTS service instance
tts_service = TTSService()
