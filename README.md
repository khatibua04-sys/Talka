# Talka - Text-to-Speech Platform

A self-hosted Text-to-Speech (TTS) web platform powered by ChatTTS, featuring voice cloning, multi-language support, and full audio control.

> **Latest Version: 1.0.3** - All security vulnerabilities fixed. Next.js upgraded to 15.2.3. See [SECURITY.md](SECURITY.md) for details.

## Features

- 🎙️ **Voice Cloning**: Upload 1-5 minute voice samples to create custom voices
- 🗣️ **Text-to-Speech**: Convert text to natural-sounding speech
- 🌍 **Multi-Language**: Support for English and Swahili
- 👤 **User Accounts**: Secure authentication and personal voice libraries
- ⚙️ **Full Control**: Adjust speed, pitch, and output format (MP3/WAV)
- 💾 **Audio Management**: Playback, download, and history tracking
- 🚀 **GPU Support**: Accelerated processing with CUDA
- 🔒 **Self-Hosted**: No paid APIs, complete data privacy

## Tech Stack

**Backend:**
- FastAPI (Python)
- ChatTTS (Open-source TTS)
- SQLAlchemy (Database ORM)
- PyTorch (GPU acceleration)
- JWT Authentication

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- CSS Modules

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- (Optional) CUDA-compatible GPU for acceleration

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/khatibua04-sys/Talka.git
cd Talka
```

2. Create environment file:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

3. Update `backend/.env` with your secret key:
```
SECRET_KEY=your-secure-random-secret-key-here
```

4. Start with Docker Compose:
```bash
docker-compose up -d
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. For GPU support (optional):
```bash
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
```

5. Set up environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

6. Run the server:
```bash
python main.py
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## Usage

### 1. Register an Account
- Visit http://localhost:3000
- Click "Register" and create your account

### 2. Upload Voice Samples (Optional)
- Go to the "Voices" tab
- Upload a 1-5 minute clean audio recording
- Supported formats: WAV, MP3, M4A, FLAC
- Add a name and description for your voice

### 3. Generate Speech
- Go to the "Dashboard"
- Enter your text (up to 5000 characters)
- Select a voice (or use default)
- Choose language (English or Swahili)
- Adjust speed and pitch
- Select output format (MP3 or WAV)
- Click "Generate Speech"

### 4. Download and Play
- Listen to the generated audio
- Download in your preferred format
- View generation history in the "History" tab

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user info

**Voices:**
- `POST /api/voices/upload` - Upload voice sample
- `GET /api/voices/` - List available voices
- `GET /api/voices/{id}` - Get specific voice
- `DELETE /api/voices/{id}` - Delete voice

**Text-to-Speech:**
- `POST /api/tts/generate` - Generate speech from text
- `GET /api/tts/download/{filename}` - Download audio file
- `GET /api/tts/history` - Get generation history
- `DELETE /api/tts/history/{id}` - Delete history item

## Configuration

### Backend Configuration

Edit `backend/.env`:

```env
DATABASE_URL=sqlite:///./talka.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs
MAX_VOICE_DURATION_SECONDS=300
MIN_VOICE_DURATION_SECONDS=60
```

### Frontend Configuration

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## GPU Support

For CUDA-enabled GPU acceleration:

1. Install CUDA toolkit (11.8 or compatible)
2. Install PyTorch with CUDA:
```bash
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
```

3. The application will automatically detect and use GPU if available

## Project Structure

```
Talka/
├── backend/
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── voice_routes.py
│   │   └── tts_routes.py
│   ├── main.py
│   ├── auth.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── tts_service.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── voices/
│   │   ├── history/
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── tts.ts
│   ├── styles/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

### Linting

Backend:
```bash
cd backend
flake8 .
black .
```

Frontend:
```bash
cd frontend
npm run lint
```

## Troubleshooting

### Backend Issues

**ChatTTS model loading fails:**
- Ensure sufficient disk space (models are ~2GB)
- Check internet connection for first-time download
- Verify PyTorch installation

**GPU not detected:**
- Verify CUDA installation: `nvidia-smi`
- Check PyTorch CUDA version: `python -c "import torch; print(torch.cuda.is_available())"`
- Reinstall PyTorch with correct CUDA version

**Audio processing errors:**
- Install ffmpeg: `apt-get install ffmpeg` (Linux) or `brew install ffmpeg` (Mac)
- Ensure libsndfile is installed

### Frontend Issues

**API connection fails:**
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check if backend is running on port 8000
- Ensure CORS is properly configured

**Build errors:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ChatTTS](https://github.com/2noise/ChatTTS) - Open-source TTS model
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework for production

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for the open-source community