# HireStream Deployment Guide

## Database Configuration

**NeonDB Connection String:**
```
connection string
```

---

## Backend Deployment (Vercel)

### Environment Variables Required:
Set these in Vercel Dashboard → Backend Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_6BoFVI1RGUgr@ep-blue-rain-aq4iqox5-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Generate a secure random string |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |

### Deployment Steps:
1. Push code to GitHub
2. Import project in Vercel: https://vercel.com/import
3. Select the repository
4. Framework Preset: **Other**
5. Build Command: Leave empty
6. Output Directory: Leave empty
7. Click **Deploy**

---

## Frontend Deployment (Vercel)

### Environment Variables Required:
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-project.vercel.app` |
| `VITE_STRIPE_PUBLIC_KEY` | Your Stripe public key |

### Update Configuration:
Before deploying, edit `frontend/vercel.json` and replace `your-backend-url.vercel.app` with your actual backend URL.

### Deployment Steps:
1. Push code to GitHub
2. Import project in Vercel: https://vercel.com/import
3. Select the repository
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variables
8. Click **Deploy**

---

## Project Structure

```
hirestream/
├── backend/
│   ├── vercel.json    # Backend Vercel config
│   ├── server.js      # Express entry point
│   ├── .env           # Local environment variables
│   └── ...
├── frontend/
│   ├── vercel.json    # Frontend Vercel config
│   ├── vite.config.js
│   └── ...
├── deployment.md      # This file
└── package.json       # Root package (not needed for deployment)
```

---

## Running Locally After Deployment

Update frontend `.env` to point to production backend:
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## Troubleshooting

- **CORS Issues**: Ensure backend has `cors()` middleware configured for production domain
- **Database Connection**: Verify NeonDB credentials and SSL settings
- **API Routes**: Check that all routes are prefixed with `/api/` in Vercel routing