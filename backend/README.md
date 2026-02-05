# Talka Backend

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Run the server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## GPU Support

For GPU acceleration with CUDA:
```bash
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
```

## Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Voices
- `POST /api/voices/upload` - Upload voice for cloning
- `GET /api/voices/` - List available voices
- `GET /api/voices/{voice_id}` - Get specific voice
- `DELETE /api/voices/{voice_id}` - Delete voice

### Text-to-Speech
- `POST /api/tts/generate` - Generate speech from text
- `GET /api/tts/download/{filename}` - Download audio file
- `GET /api/tts/history` - Get generation history
- `DELETE /api/tts/history/{history_id}` - Delete history item
