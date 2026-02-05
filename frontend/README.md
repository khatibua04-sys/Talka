# Talka Frontend

Next.js-based frontend for the Talka Text-to-Speech platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Features

- User authentication (login/register)
- TTS dashboard with controls
- Voice cloning management
- Generation history
- Audio playback and download

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules
- Axios for API calls
