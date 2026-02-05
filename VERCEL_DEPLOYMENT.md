# Vercel Deployment Guide for Talka

This guide explains how to deploy the Talka Text-to-Speech platform frontend to Vercel.

## Overview

Talka consists of:
- **Frontend**: Next.js application (deployed to Vercel)
- **Backend**: FastAPI Python application (requires separate hosting)

This guide covers deploying the frontend to Vercel. The backend must be hosted separately (e.g., Railway, Render, AWS, DigitalOcean, or your own server).

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier available)
2. Your backend API deployed and accessible via HTTPS
3. GitHub repository access (for automatic deployments)

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/khatibua04-sys/Talka.git
   cd Talka
   ```

2. **Push to Your GitHub Repository** (if not already)
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/Talka.git
   git push -u origin main
   ```

3. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository: `Talka`

4. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following variable:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-backend-api-url.com` (your deployed backend URL)
     - **Environment**: Production, Preview, Development

6. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 2-3 minutes)
   - Your app will be available at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

4. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? `talka-tts`
   - In which directory is your code located? `./`

5. **Set Environment Variable**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   ```
   Enter your backend API URL when prompted.

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 3: One-Click Deploy Button

Add this to your README.md for easy deployment:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/khatibua04-sys/Talka&root-directory=frontend&env=NEXT_PUBLIC_API_URL&envDescription=Backend%20API%20URL&envLink=https://github.com/khatibua04-sys/Talka#backend-deployment)
```

## Environment Variables

You need to configure the following environment variable in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL (must be HTTPS in production) | `https://api.example.com` |

### Setting Environment Variables in Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. Add `NEXT_PUBLIC_API_URL` with your backend URL
5. Select which environments to apply to (Production, Preview, Development)
6. Click "Save"
7. Redeploy your application for changes to take effect

## Backend Deployment Options

The backend must be deployed separately. Here are recommended options:

### 1. Railway (Recommended for Python apps)

**Pros**: Easy Python deployment, automatic HTTPS, generous free tier
**Cons**: May have cold starts on free tier

Steps:
1. Sign up at [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Select the `backend` directory
4. Add environment variables (SECRET_KEY, DATABASE_URL, etc.)
5. Deploy automatically
6. Copy the generated URL and use it as `NEXT_PUBLIC_API_URL` in Vercel

### 2. Render

**Pros**: Free tier available, easy setup
**Cons**: Cold starts on free tier

Steps:
1. Sign up at [Render](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repository
4. Set root directory to `backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables
8. Deploy

### 3. Fly.io

**Pros**: Good free tier, global deployment
**Cons**: Requires Docker knowledge

Steps:
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Navigate to backend: `cd backend`
4. Initialize: `fly launch`
5. Deploy: `fly deploy`

### 4. DigitalOcean App Platform

**Pros**: Reliable, scalable
**Cons**: Starts at $5/month (no free tier)

Steps:
1. Create DigitalOcean account
2. Create new App
3. Connect GitHub repository
4. Select backend directory
5. Configure build and run commands
6. Add environment variables
7. Deploy

### 5. AWS EC2 / Azure / GCP

For full control and production deployments, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Custom Domain

### Adding a Custom Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Enter your domain name (e.g., `talka.yourdomain.com`)
4. Click "Add"
5. Follow the DNS configuration instructions
6. Wait for DNS propagation (can take up to 48 hours)

### DNS Configuration

Add these records to your domain's DNS settings:

**For Subdomain (e.g., talka.example.com):**
```
Type: CNAME
Name: talka
Value: cname.vercel-dns.com
```

**For Root Domain (e.g., example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

## Automatic Deployments

Vercel automatically deploys your application when you push to GitHub:

- **Push to main branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

### Deployment Workflow

1. Make changes to your code
2. Commit and push to GitHub
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Vercel automatically detects the push and deploys
4. Check deployment status in Vercel Dashboard or via GitHub integration

## Build Settings

If you need to customize build settings, you can use `vercel.json` in the root directory:

```json
{
  "version": 2,
  "name": "talka-tts-platform",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

Or configure in the Vercel Dashboard under "Settings" → "General".

## Performance Optimization

### Enable Caching

Vercel automatically caches your static assets and pages. You can configure caching headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/outputs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### Enable Analytics

1. Go to your project in Vercel Dashboard
2. Click "Analytics"
3. Enable "Speed Insights" and "Web Vitals"
4. Monitor your app's performance

### Edge Functions (Optional)

For faster global performance, you can enable Edge Functions in `next.config.js`:

```javascript
module.exports = {
  experimental: {
    runtime: 'edge',
  },
}
```

## Monitoring and Logs

### View Deployment Logs

1. Go to your project in Vercel Dashboard
2. Click "Deployments"
3. Select a deployment
4. View "Build Logs" and "Function Logs"

### Real-time Logs

Use Vercel CLI to stream logs:
```bash
vercel logs
```

## Troubleshooting

### Build Fails

**Error: `Module not found`**
- Solution: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: `Build exceeded maximum duration`**
- Solution: Optimize build process or upgrade Vercel plan

### Environment Variables Not Working

- Ensure variable names start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check that variables are set for the correct environment (Production/Preview)

### Backend API Not Reachable

- Verify `NEXT_PUBLIC_API_URL` is correct and includes protocol (https://)
- Check CORS settings in your backend to allow Vercel domain
- Ensure backend is running and accessible

### Update Backend CORS

In your `backend/main.py`, add your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel domain
        "https://your-custom-domain.com",  # Add custom domain if applicable
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy your backend after updating CORS settings.

### 404 on Page Refresh

This is usually not an issue with Next.js on Vercel, but if you encounter it:
- Ensure you're using Next.js App Router (which you are)
- Check that your routes are properly defined

## Security Best Practices

1. **Use HTTPS Only**
   - Vercel provides HTTPS by default
   - Ensure your backend also uses HTTPS

2. **Secure Environment Variables**
   - Never commit `.env` files to Git
   - Use Vercel's environment variable management
   - Rotate secrets regularly

3. **Enable CORS Properly**
   - Only allow your Vercel domain in backend CORS
   - Don't use `allow_origins=["*"]` in production

4. **Rate Limiting**
   - Implement rate limiting on your backend
   - Use Vercel's Web Application Firewall (WAF) if on Pro plan

5. **Content Security Policy**
   - Add CSP headers to prevent XSS attacks
   - Configure in `next.config.js`

## Cost Estimation

### Vercel Pricing

**Hobby (Free):**
- 100 GB bandwidth/month
- Unlimited personal projects
- Automatic HTTPS
- Good for personal projects and testing

**Pro ($20/month):**
- 1 TB bandwidth/month
- Team collaboration
- Analytics
- Password protection
- Good for production applications

### Backend Hosting Costs

- **Railway Free**: $5 credit/month (good for testing)
- **Render Free**: Limited hours (good for testing)
- **Railway Pro**: ~$5-20/month (recommended for production)
- **Render Starter**: $7/month (good for small production)
- **DigitalOcean**: $5-20/month (full control)

## Production Checklist

Before going live:

- [ ] Backend deployed and accessible via HTTPS
- [ ] `NEXT_PUBLIC_API_URL` set correctly in Vercel
- [ ] CORS configured in backend to allow Vercel domain
- [ ] Custom domain configured (optional)
- [ ] SSL certificate valid
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Database backups configured (backend)
- [ ] Environment variables secured
- [ ] Rate limiting enabled (backend)
- [ ] Security headers configured

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Next.js Documentation**: https://nextjs.org/docs
- **Project Issues**: https://github.com/khatibua04-sys/Talka/issues

## Example: Complete Deployment Flow

Here's a complete example of deploying Talka to production:

### Step 1: Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize
railway init

# Add environment variables
railway variables set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# Deploy
railway up

# Get the URL
railway domain
# Output: https://talka-backend-production.up.railway.app
```

### Step 2: Deploy Frontend to Vercel

```bash
# Navigate to frontend
cd ../frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://talka-backend-production.up.railway.app

# Deploy
vercel --prod
# Output: https://talka.vercel.app
```

### Step 3: Update Backend CORS

Edit `backend/main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://talka.vercel.app",
]
```

Redeploy backend:
```bash
railway up
```

### Step 4: Test

Visit `https://talka.vercel.app` and test all features:
- Registration
- Login
- Voice upload
- Text-to-speech generation
- Audio playback and download

## Conclusion

You now have Talka deployed on Vercel! The frontend will automatically redeploy when you push changes to your GitHub repository.

For questions or issues, please open an issue on [GitHub](https://github.com/khatibua04-sys/Talka/issues).

---

Happy deploying! 🚀
