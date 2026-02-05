# Quick Deploy - Talka to Vercel

This guide will help you deploy Talka in under 5 minutes.

## What You'll Deploy

- **Frontend**: Vercel (Next.js app) - Free tier available
- **Backend**: Railway or Render (Python API) - Free tier available

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Railway account (sign up at [railway.app](https://railway.app)) OR Render account (sign up at [render.com](https://render.com))

## Step 1: Deploy Backend (Choose One)

### Option A: Railway (Recommended)

1. Go to [Railway](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose this repository
5. Select the `backend` directory as root
6. Add environment variables:
   - `SECRET_KEY`: Click "Generate" or use `python -c "import secrets; print(secrets.token_urlsafe(32))"`
   - Other variables will use defaults from `railway.json`
7. Click "Deploy"
8. Wait for deployment (2-3 minutes)
9. Copy the deployment URL (e.g., `https://talka-backend-production.up.railway.app`)

### Option B: Render

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: talka-backend
   - **Root Directory**: backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (see backend/.env.example)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes for first deploy)
8. Copy the deployment URL

## Step 2: Deploy Frontend to Vercel

### Method 1: One-Click Deploy (Easiest)

1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/khatibua04-sys/Talka&root-directory=frontend&env=NEXT_PUBLIC_API_URL)

2. When prompted for environment variables:
   - `NEXT_PUBLIC_API_URL`: Paste your backend URL from Step 1

3. Click "Deploy"

4. Done! Your app will be available at `https://your-project.vercel.app`

### Method 2: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import this GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your backend URL from Step 1
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your app is live!

## Step 3: Update Backend CORS

Your backend needs to allow requests from your Vercel frontend.

1. Go to your backend deployment (Railway or Render)
2. Add a new environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your Vercel URL (e.g., `https://your-project.vercel.app`)
3. Redeploy the backend

OR manually edit `backend/main.py` and redeploy:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-project.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Click "Register" and create an account
3. Login
4. Try generating text-to-speech
5. If it works, you're done! 🎉

## Troubleshooting

### Frontend can't reach backend

**Problem**: API requests fail

**Solutions**:
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Ensure the backend URL includes `https://` 
- Verify backend is running and accessible
- Update CORS settings in backend (Step 3)
- Redeploy frontend after changing environment variables

### Backend deployment fails

**Railway/Render**:
- Check build logs for errors
- Ensure `requirements.txt` is valid
- Verify Python version compatibility (3.10+)
- Check that all environment variables are set

### Application loads but features don't work

**Check**:
- Are environment variables set correctly?
- Is backend health endpoint accessible? (visit `YOUR_BACKEND_URL/health`)
- Check browser console for errors (F12 → Console tab)
- Verify CORS is configured correctly

## Cost Estimate

### Free Tier (Good for testing and personal use)

- **Vercel**: Free (100 GB bandwidth/month)
- **Railway**: $5 credit/month (enough for light use)
- **Render**: Free tier (limited hours, sleeps after inactivity)
- **Total**: FREE for testing

### Production (Recommended for real apps)

- **Vercel Pro**: $20/month (1 TB bandwidth)
- **Railway**: ~$5-20/month (pay for usage)
- **Render**: $7-25/month (depends on instance size)
- **Total**: ~$27-45/month

## Next Steps

- **Custom Domain**: Add your domain in Vercel settings
- **Analytics**: Enable Vercel Analytics for insights
- **Database**: Upgrade to PostgreSQL for production (see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md))
- **Monitoring**: Set up error tracking with Sentry
- **Backup**: Configure regular database backups

## Full Documentation

For more detailed information:

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Complete Vercel deployment guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Self-hosted deployment options
- [README.md](README.md) - Project overview and features

## Support

Having issues? 

1. Check the [troubleshooting section](#troubleshooting)
2. Read the [full deployment guide](VERCEL_DEPLOYMENT.md)
3. Open an issue on [GitHub](https://github.com/khatibua04-sys/Talka/issues)

---

Built with ❤️ by the Talka team
