# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2024-02-05

### Security
- Updated Next.js from 14.2.35 to 15.0.8 (fixes remaining DoS vulnerability in React Server Components)
- Updated React from 18.2.0 to 19.0.0 (compatibility with Next.js 15)
- Updated React-DOM from 18.2.0 to 19.0.0
- Updated @types/node from 20.11.5 to 22.10.0
- Updated @types/react from 18.2.48 to 19.0.0
- Updated @types/react-dom from 18.2.18 to 19.0.0
- Updated TypeScript from 5.3.3 to 5.7.2
- Updated ESLint from 8.56.0 to 8.57.0
- Updated eslint-config-next from 14.2.35 to 15.0.8

## [1.0.1] - 2024-02-05

### Security
- Updated fastapi from 0.109.0 to 0.115.0 (fixes ReDoS vulnerability)
- Updated python-multipart from 0.0.6 to 0.0.22 (fixes arbitrary file write and DoS vulnerabilities)
- Updated torch from 2.1.2 to 2.6.0 (fixes heap buffer overflow, use-after-free, and RCE vulnerabilities)
- Updated torchaudio from 2.1.2 to 2.6.0
- Updated axios from 1.6.5 to 1.12.0 (fixes DoS and SSRF vulnerabilities)
- Updated Next.js from 14.1.0 to 14.2.35 (partial fix for DoS, cache poisoning, and authorization bypass vulnerabilities)
- Updated pydantic from 2.5.3 to 2.10.0
- Updated pydantic-settings from 2.1.0 to 2.6.0
- Updated uvicorn from 0.27.0 to 0.32.0

## [1.0.0] - 2024-02-05

### Added
- Initial release of Talka Text-to-Speech Platform
- FastAPI backend with REST API
- Next.js 14 frontend with TypeScript
- User authentication system with JWT
- Text-to-Speech conversion using ChatTTS
- Voice cloning with 1-5 minute audio samples
- Multi-language support (English and Swahili)
- Speed and pitch control (0.5x-2.0x range)
- Audio output in MP3 and WAV formats
- Voice library management
- Generation history tracking
- Audio playback and download
- Docker containerization
- GPU support for acceleration
- Comprehensive API documentation
- Setup scripts for Linux/Mac and Windows
- Deployment guide
- Contributing guidelines
- Voice recording guide
- API testing documentation

### Features
- 🎙️ Voice Cloning: Upload voice samples to create custom voices
- 🗣️ Text-to-Speech: Convert text to natural-sounding speech
- 🌍 Multi-Language: Support for English and Swahili
- 👤 User Accounts: Secure authentication and personal voice libraries
- ⚙️ Full Control: Adjust speed, pitch, and output format
- 💾 Audio Management: Playback, download, and history tracking
- 🚀 GPU Support: Accelerated processing with CUDA
- 🔒 Self-Hosted: No paid APIs, complete data privacy

### Technical Stack
- **Backend**: FastAPI, ChatTTS, PyTorch, SQLAlchemy, librosa, pydub
- **Frontend**: Next.js 14, React 18, TypeScript, CSS Modules
- **Database**: SQLite (with PostgreSQL support)
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Docker, Docker Compose

### Security
- Password hashing with bcrypt
- JWT token-based authentication
- Environment variable configuration
- CORS protection
- Input validation and sanitization

### Documentation
- README with comprehensive setup instructions
- API documentation via Swagger/ReDoc
- API testing guide with curl examples
- Deployment guide for various platforms
- Contributing guidelines
- Voice recording guide with sample scripts
- Troubleshooting section

## [Unreleased]

### Planned
- Additional language support
- Batch processing capabilities
- Audio effects (reverb, echo, etc.)
- Voice mixing and blending
- Automated tests
- Performance optimizations
- Mobile app support
- Real-time TTS streaming
- Voice presets library
- Admin dashboard

---

For more details, see the [GitHub releases](https://github.com/khatibua04-sys/Talka/releases).
