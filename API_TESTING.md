# API Testing Guide

This document provides examples for testing the Talka API endpoints.

## Base URL
```
http://localhost:8000
```

## Authentication

### 1. Register a New User

**Request:**
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "testuser",
  "created_at": "2024-02-05T12:00:00"
}
```

### 2. Login

**Request:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

Save the access_token for use in subsequent requests.

### 3. Get Current User

**Request:**
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Voice Management

### 1. Upload Voice for Cloning

**Request:**
```bash
curl -X POST "http://localhost:8000/api/voices/upload" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=My Voice" \
  -F "description=A sample voice" \
  -F "language=en" \
  -F "is_public=false" \
  -F "file=@/path/to/voice_sample.wav"
```

**Response:**
```json
{
  "id": 1,
  "name": "My Voice",
  "description": "A sample voice",
  "audio_path": "/app/uploads/voices/uuid.wav",
  "duration": 120.5,
  "language": "en",
  "user_id": 1,
  "created_at": "2024-02-05T12:00:00",
  "is_public": false
}
```

### 2. List Available Voices

**Request:**
```bash
curl -X GET "http://localhost:8000/api/voices/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Get Specific Voice

**Request:**
```bash
curl -X GET "http://localhost:8000/api/voices/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Delete Voice

**Request:**
```bash
curl -X DELETE "http://localhost:8000/api/voices/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Text-to-Speech

### 1. Generate Speech

**Request:**
```bash
curl -X POST "http://localhost:8000/api/tts/generate" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test of the text to speech system.",
    "voice_id": 1,
    "speed": 1.0,
    "pitch": 1.0,
    "language": "en",
    "output_format": "mp3"
  }'
```

**Response:**
```json
{
  "output_path": "/api/tts/download/uuid.mp3",
  "duration": 3.5,
  "history_id": 1
}
```

### 2. Generate Speech with Default Voice

**Request:**
```bash
curl -X POST "http://localhost:8000/api/tts/generate" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world!",
    "speed": 1.2,
    "pitch": 0.9,
    "language": "en",
    "output_format": "wav"
  }'
```

### 3. Generate Swahili Speech

**Request:**
```bash
curl -X POST "http://localhost:8000/api/tts/generate" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Habari yako? Unafanya nini?",
    "speed": 1.0,
    "pitch": 1.0,
    "language": "sw",
    "output_format": "mp3"
  }'
```

### 4. Download Generated Audio

**Request:**
```bash
curl -X GET "http://localhost:8000/api/tts/download/uuid.mp3" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --output output.mp3
```

### 5. Get Generation History

**Request:**
```bash
curl -X GET "http://localhost:8000/api/tts/history?skip=0&limit=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "text": "Hello, this is a test...",
    "voice_id": 1,
    "speed": 1.0,
    "pitch": 1.0,
    "output_path": "/app/outputs/uuid.mp3",
    "language": "en",
    "created_at": "2024-02-05T12:00:00"
  }
]
```

### 6. Delete History Item

**Request:**
```bash
curl -X DELETE "http://localhost:8000/api/tts/history/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Parameter Ranges

### Speed
- Min: 0.5 (50% speed)
- Max: 2.0 (200% speed)
- Default: 1.0 (normal speed)

### Pitch
- Min: 0.5 (lower pitch)
- Max: 2.0 (higher pitch)
- Default: 1.0 (normal pitch)

### Text Length
- Min: 1 character
- Max: 5000 characters

### Voice Audio Duration
- Min: 60 seconds (1 minute)
- Max: 300 seconds (5 minutes)

## Supported Audio Formats

### Upload (Voice Cloning)
- WAV
- MP3
- M4A
- FLAC

### Output (Generated Speech)
- MP3
- WAV

## Language Codes

- `en` - English
- `sw` - Swahili

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid file format. Supported formats: wav, mp3, m4a, flac"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Voice not found"
}
```

### 403 Forbidden
```json
{
  "detail": "You don't have permission to access this voice"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Failed to generate speech: [error details]"
}
```

## Using Python Requests

```python
import requests

# Base URL
BASE_URL = "http://localhost:8000"

# Register
response = requests.post(
    f"{BASE_URL}/api/auth/register",
    json={
        "email": "user@example.com",
        "username": "testuser",
        "password": "password123"
    }
)
print(response.json())

# Login
response = requests.post(
    f"{BASE_URL}/api/auth/login",
    data={
        "username": "testuser",
        "password": "password123"
    }
)
token = response.json()["access_token"]

# Generate Speech
headers = {"Authorization": f"Bearer {token}"}
response = requests.post(
    f"{BASE_URL}/api/tts/generate",
    headers=headers,
    json={
        "text": "Hello, world!",
        "speed": 1.0,
        "pitch": 1.0,
        "language": "en",
        "output_format": "mp3"
    }
)
print(response.json())

# Download Audio
audio_path = response.json()["output_path"]
response = requests.get(
    f"{BASE_URL}{audio_path}",
    headers=headers
)
with open("output.mp3", "wb") as f:
    f.write(response.content)
```

## Using JavaScript/Fetch

```javascript
const BASE_URL = "http://localhost:8000";

// Register
const register = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      username: "testuser",
      password: "password123"
    })
  });
  return response.json();
};

// Login
const login = async () => {
  const formData = new FormData();
  formData.append("username", "testuser");
  formData.append("password", "password123");
  
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  return data.access_token;
};

// Generate Speech
const generateSpeech = async (token) => {
  const response = await fetch(`${BASE_URL}/api/tts/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: "Hello, world!",
      speed: 1.0,
      pitch: 1.0,
      language: "en",
      output_format: "mp3"
    })
  });
  return response.json();
};
```

## Interactive API Documentation

Visit the following URLs for interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide a web interface to test all endpoints directly from your browser.
