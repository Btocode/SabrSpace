# 🚀 SabrSpace Deployment Guide

This guide covers deploying SabrSpace to production. You have multiple options depending on your preferences and infrastructure needs.

## Quick Answer: Can I deploy both together?

**Yes!** You can deploy both frontend and backend together on Vercel using serverless functions, but it requires code restructuring. For simplicity, separate deployments are recommended for your first deployment.

## Deployment Options

### 🚨 Fix Your Current Vercel Deployment

If you're getting a download dialog, your Vercel deployment is misconfigured. Here's how to fix it:

### Step 1: Update Vercel Build Settings
In your Vercel dashboard:

1. **Build Command**: `cd client && npm run build`
2. **Output Directory**: `client/dist`
3. **Install Command**: `npm install`

### Step 2: Add Environment Variables
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### Step 3: Update Client for API Proxy
```typescript
// client/src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Step 4: Redeploy
```bash
# Trigger new deployment
git push origin main
```

## Option 1: Separate Deployments (Recommended for beginners)

### 1. Backend Deployment (Railway)

#### Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up/Sign in with GitHub

#### Deploy Backend
```bash
# Fork this repository
git clone https://github.com/yourusername/SabrSpace.git
cd SabrSpace

# Create Railway project
railway login
railway init

# Set environment variables
railway variables set DATABASE_URL=your_postgresql_url
railway variables set JWT_SECRET=your_super_secret_jwt_key
railway variables set NODE_ENV=production

# Deploy
railway up
```

#### Get Backend URL
```bash
railway domain
# Copy the URL (e.g., https://sabrspace-production.up.railway.app)
```

### 2. Frontend Deployment (Vercel)

#### Prepare Frontend for Vercel
```bash
# Update client/vercel.json with your backend URL
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.railway.app/api/$1"
    }
  ]
}
```

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod

# Or connect GitHub repository in Vercel dashboard
```

#### Set Environment Variables in Vercel
- No environment variables needed for frontend (API calls proxy to backend)

## Option 2: Vercel + Supabase

### 1. Database Setup (Supabase)

#### Create Supabase Project
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Get your database URL and anon key

#### Run Migrations
```bash
# In your local development
pnpm run db:push

# Or run SQL migrations in Supabase dashboard
```

### 2. Backend Deployment (Vercel)

#### Convert to Vercel API Routes
```bash
# Move server routes to api/ directory
mkdir api
cp -r server/* api/

# Update api routes to work with Vercel
# (Modify server files to export Vercel handlers)
```

#### Deploy Both Frontend and Backend
```bash
# Deploy entire project to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# DATABASE_URL=your_supabase_connection_string
# JWT_SECRET=your_jwt_secret
```

## Option 3: Single Vercel Deployment

### Full-Stack Vercel Deployment
```typescript
// api/index.ts
import { createServer } from '../server/index';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const app = await createServer();
  app(req, res);
};
```

```json
// vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/client/$1" }
  ]
}
```

## Environment Variables

### Required Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=production
```

### Optional Variables
```env
# For Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# For email services (future feature)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] User registration/login functional
- [ ] Question set creation working
- [ ] Response submission working
- [ ] Language switching functional
- [ ] HTTPS enabled
- [ ] Domain configured (optional)

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check your DATABASE_URL format
# PostgreSQL: postgresql://user:pass@host:port/db
# Supabase: Use the connection string from project settings
```

**Build Failures**
```bash
# Check TypeScript errors
pnpm run check

# Check for missing dependencies
pnpm install
```

**API Routes Not Working**
```bash
# Verify backend URL in client/vercel.json
# Check CORS settings in server
# Ensure environment variables are set
```

## Performance Optimization

### Vercel Optimizations
- Enable Vercel Analytics
- Set up proper caching headers
- Use Vercel's image optimization

### Database Optimizations
- Enable connection pooling
- Set up proper indexes
- Monitor query performance

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor function execution times
- Check error rates
- View real-time logs

### Database Monitoring
- Monitor connection counts
- Set up automated backups
- Track query performance

## Option 4: Single Vercel Deployment (Advanced)

If you want everything on Vercel, you can deploy both frontend and backend together:

### Restructure for Vercel
```bash
# Move API routes to api/ directory
mkdir api
cp server/routes.ts api/index.ts
cp -r server/auth api/
cp server/storage.ts api/

# Modify api/index.ts for Vercel
```

### Vercel Configuration
```json
// vercel.json (in root)
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/client/$1" }
  ]
}
```

### Pros of Single Deployment
- ✅ One platform to manage
- ✅ Automatic HTTPS
- ✅ Built-in CDN
- ✅ Serverless scaling

### Cons of Single Deployment
- ❌ More complex setup
- ❌ Vercel serverless limitations
- ❌ Database connection pooling issues
- ❌ Cold start latency

## Recommendation

**For your first deployment:** Use **Option 1 (Vercel + Railway)** - it's simpler and more reliable.

**For advanced users:** Use **Option 4 (Single Vercel)** if you want everything in one place.

**Database choice:** Railway or Supabase both work great. Railway is simpler for beginners.

---

**Need help?** Open an issue on GitHub or check the documentation!
