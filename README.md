# Talka

A simple web application ready for deployment on Vercel.

## 🚀 Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/khatibua04-sys/Talka)

Click the button above to deploy this project to Vercel with one click!

### Manual Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   vercel
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## 📦 Project Structure

```
Talka/
├── index.html      # Main HTML page
├── package.json    # Node.js package configuration
├── vercel.json     # Vercel deployment configuration
└── README.md       # This file
```

## 🛠️ Local Development

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/khatibua04-sys/Talka.git
   cd Talka
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

## 📝 Vercel Configuration

The `vercel.json` file contains the deployment configuration:
- Static file serving for `index.html`
- Route configuration for single-page application behavior

## 🎯 Features

- ✅ Ready for Vercel deployment
- ✅ Simple static HTML page
- ✅ Responsive design
- ✅ No build process required
- ✅ Fast deployment

## 📄 License

ISC