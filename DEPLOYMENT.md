# Deployment Guide

This guide covers different deployment options for Talka.

> **Looking to deploy to Vercel?** See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for a complete guide to deploying the frontend to Vercel and backend to Railway/Render.

## Table of Contents
- [Vercel Deployment (Recommended)](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Production Considerations](#production-considerations)
- [Cloud Deployment](#cloud-deployment)

## Vercel Deployment

For quick cloud deployment with Vercel (frontend) and Railway/Render (backend):

👉 **[Complete Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)**

Quick overview:
1. Deploy backend to Railway or Render
2. Deploy frontend to Vercel with one click
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Done! Your app is live

## Docker Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 1.29+
- (Optional) NVIDIA Docker for GPU support

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/khatibua04-sys/Talka.git
cd Talka
```

2. Create environment files:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and set a secure SECRET_KEY

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Edit if needed (default should work)
```

3. Build and start:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### GPU Support

For NVIDIA GPU support, ensure you have:
- NVIDIA drivers installed
- NVIDIA Docker runtime installed

The docker-compose.yml is already configured for GPU access.

### Custom Ports

Edit `docker-compose.yml` to change ports:
```yaml
services:
  backend:
    ports:
      - "8000:8000"  # Change left side: "CUSTOM_PORT:8000"
  
  frontend:
    ports:
      - "3000:3000"  # Change left side: "CUSTOM_PORT:3000"
```

## Manual Deployment

### Backend Deployment

#### On Ubuntu/Debian

1. Install system dependencies:
```bash
sudo apt-get update
sudo apt-get install -y python3.10 python3-pip python3-venv ffmpeg libsndfile1
```

2. Set up the application:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with production settings
```

4. Run with systemd (recommended):

Create `/etc/systemd/system/talka-backend.service`:
```ini
[Unit]
Description=Talka Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/talka/backend
Environment="PATH=/opt/talka/backend/venv/bin"
ExecStart=/opt/talka/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable talka-backend
sudo systemctl start talka-backend
```

#### With Gunicorn (Alternative)

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment

#### Build for Production

```bash
cd frontend
npm install
npm run build
```

#### Serve with PM2

```bash
npm install -g pm2
pm2 start npm --name "talka-frontend" -- start
pm2 save
pm2 startup
```

#### Serve with systemd

Create `/etc/systemd/system/talka-frontend.service`:
```ini
[Unit]
Description=Talka Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/talka/frontend
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## Production Considerations

### Security

1. **Generate Strong Secret Key**:
```python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Add to backend/.env:
```
SECRET_KEY=your-generated-secret-key
```

2. **Enable HTTPS**:
Use nginx or Caddy as reverse proxy with SSL certificates.

3. **Set Secure CORS Origins**:
Edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. **Use PostgreSQL** (instead of SQLite):
```bash
pip install psycopg2-binary
```
Update backend/.env:
```
DATABASE_URL=postgresql://user:password@localhost/talka
```

### Performance

1. **Enable Redis Caching** (optional):
```bash
pip install redis
```

2. **Use CDN** for static assets

3. **Configure Workers**:
- Backend: 2-4 workers per CPU core
- Frontend: Use multiple instances behind load balancer

### Monitoring

1. **Application Logs**:
```bash
# Backend logs
sudo journalctl -u talka-backend -f

# Frontend logs
sudo journalctl -u talka-frontend -f
```

2. **Health Checks**:
- Backend: http://localhost:8000/health
- Frontend: http://localhost:3000

### Backup

Backup important data:
```bash
# Database
cp backend/talka.db backend/talka.db.backup

# User uploads
tar -czf uploads-backup.tar.gz backend/uploads/

# Generated audio (optional)
tar -czf outputs-backup.tar.gz backend/outputs/
```

## Nginx Reverse Proxy

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API Documentation
    location /docs {
        proxy_pass http://localhost:8000;
    }
    
    # File size limit for voice uploads
    client_max_body_size 50M;
}
```

## Cloud Deployment

### AWS EC2

1. Launch Ubuntu 22.04 instance (t3.large or better)
2. For GPU: Use g4dn.xlarge with Deep Learning AMI
3. Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
4. Follow manual deployment steps
5. Set up Elastic IP for static IP
6. Use EFS for shared storage (optional)

### Google Cloud Platform

1. Create Compute Engine instance
2. Use GPU-enabled machine type if needed
3. Follow manual deployment steps
4. Set up Cloud Load Balancer (optional)

### DigitalOcean

1. Create Droplet (Ubuntu 22.04)
2. Size: 2GB RAM minimum, 4GB recommended
3. Follow manual deployment steps
4. Use Managed Database for PostgreSQL (optional)

### Azure

1. Create Virtual Machine (Ubuntu 22.04)
2. For GPU: Use NC-series VMs
3. Follow manual deployment steps
4. Use Azure Database for PostgreSQL (optional)

## Environment Variables Reference

### Backend (.env)

```bash
# Database
DATABASE_URL=sqlite:///./talka.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Storage
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs

# Voice Cloning Limits
MAX_VOICE_DURATION_SECONDS=300
MIN_VOICE_DURATION_SECONDS=60

# Optional: Redis
# REDIS_URL=redis://localhost:6379

# Optional: PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost/talka
```

### Frontend (.env.local)

```bash
# API URL (update for production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Permission Errors

```bash
# Fix ownership
sudo chown -R www-data:www-data /opt/talka

# Fix permissions
sudo chmod -R 755 /opt/talka
```

### Out of Memory

- Reduce number of workers
- Add swap space
- Upgrade instance size

### GPU Not Working

```bash
# Check NVIDIA driver
nvidia-smi

# Check PyTorch CUDA
python -c "import torch; print(torch.cuda.is_available())"

# Reinstall PyTorch with CUDA
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
```

## Scaling

For high-traffic deployments:

1. **Load Balancer**: Distribute traffic across multiple instances
2. **Separate Services**: Run backend and frontend on different servers
3. **Database**: Use managed PostgreSQL service
4. **File Storage**: Use S3 or similar for uploads/outputs
5. **Caching**: Add Redis for session management
6. **Queue System**: Use Celery for async TTS generation

## Monitoring Tools

Recommended tools:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Sentry**: Error tracking
- **LogDNA/Papertrail**: Log management
- **UptimeRobot**: Uptime monitoring

## Support

For deployment issues:
- Check the logs
- Review troubleshooting section
- Open an issue on GitHub
- Consult the community

---

Good luck with your deployment! 🚀
