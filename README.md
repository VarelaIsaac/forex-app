# Pancake, a Forex Trading Platform - Next.js

## 🚀 Quick Start

### Backend (NestJS)
```bash
cd pancake-backend
npm install
npm run start:dev
```
The backend will run on **http://localhost:3001**

### Frontend (Next.js)
```bash
cd pancake-nextjs
npm install
npm run dev
```
The frontend will run on **http://localhost:3000**

## 📁 Project Structure

```
forex-app/
├── pancake-backend/     # NestJS API (Port 3001)
│   ├── src/
│   │   ├── auth/       # Authentication
│   │   ├── trading/    # Trading operations
│   │   ├── portfolio/  # Portfolio management
│   │   └── events/     # WebSocket gateway
│   └── prisma/         # Database schema
│
├── pancake-nextjs/     # Next.js Frontend (Port 3000)
│   ├── app/            # Next.js App Router
│   │   ├── page.tsx   # Dashboard page
│   │   └── layout.tsx # Root layout
│   └── components/     # React components
│       ├── dashboard/ # Dashboard components
│       └── ui/        # Shadcn UI components
│
└── pancake-frontend/   # Vite (legacy - can be removed)
```

## 🔧 Configuration

### Backend (.env)
- `PORT=3001` - Backend API port
- `JWT_SECRET` - JWT authentication secret
- `DATABASE_URL` - PostgreSQL connection string

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL=http://localhost:3001` - Backend API URL
- `NEXT_PUBLIC_WS_URL=ws://localhost:3001` - WebSocket URL

## 🚀 Vercel Deployment

Deploy the apps separately:

1. Deploy `pancake-nextjs` to Vercel.
2. Deploy `pancake-backend` to a backend host that supports a persistent Node server and websockets, such as Render, Railway, Fly.io, or a VPS.
3. Point the frontend env vars at the deployed backend.

### Frontend env vars on Vercel

Set these in the Vercel project for `pancake-nextjs`:

- `NEXT_PUBLIC_API_URL=https://your-backend-domain`
- `NEXT_PUBLIC_WS_URL=wss://your-backend-domain`
- `APP_BASE_URL=https://your-vercel-project.vercel.app`
- `AUTH0_DOMAIN=genai-4983036869979147.us.auth0.com`
- `AUTH0_CLIENT_ID=75SpBxZdfIOEsKvpOwZwKFSGVQ3Gwbfi` 
- `AUTH0_CLIENT_SECRET=...`
- `AUTH0_SECRET=...`
- `AUTH0_AUDIENCE=https://genai-4983036869979147.us.auth0.com/api/v2/`

### Backend env vars on the API host

Set these in the backend deployment:

- `PORT=3001` or the host-provided port
- `NODE_ENV=production`
- `CORS_ORIGIN=https://your-vercel-project.vercel.app`
- `DATABASE_URL=...`
- `JWT_SECRET=...`
- `AUTH0_DOMAIN=genai-4983036869979147.us.auth0.com`
- `AUTH0_AUDIENCE=https://genai-4983036869979147.us.auth0.com/api/v2/`

### Auth0 settings

Update your Auth0 application to allow the deployed frontend URL:

- Allowed Callback URLs: `https://your-vercel-project.vercel.app/api/auth/callback`
- Allowed Logout URLs: `https://your-vercel-project.vercel.app`
- Allowed Web Origins: `https://your-vercel-project.vercel.app`

### Important note

The NestJS backend is not a good fit for Vercel as-is because it relies on a long-running server and Socket.IO. If you want a single Vercel deployment only, the backend would need to be refactored into serverless route handlers and the websocket flow would need to be replaced.

## 🎨 Design Features

- Modern dark theme with OKLCH color space
- Real-time currency charts
- WebSocket live price updates
- Responsive dashboard layout
- Educational glossary panel
- Quick trade interface

## 🔗 API Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /trading/pairs` - Get currency pairs
- `POST /trading/open` - Open a trade
- `POST /trading/close` - Close a trade
- `GET /portfolio/balance` - Get user balance
- `WS /` - WebSocket for real-time updates

## 📚 Documentation

API documentation is available at: **http://localhost:3001/api**




frontend .env.local

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Application Configuration
NEXT_PUBLIC_APP_NAME="Pancake"
NEXT_PUBLIC_APP_ENV=development

# Auth0 Configuration (v4 SDK)
# Get these values from https://manage.auth0.com → Applications → Your App → Settings

# A long random secret used to encrypt the session cookie
# Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=genai-4983036869979147.us.auth0.com
AUTH0_CLIENT_ID=75SpBxZdfIOEsKvpOwZwKFSGVQ3Gwbfi
AUTH0_CLIENT_SECRET=cAms_3oGMzhw-x_IA_q2FG5vJLU7a0NZrBHoNnY6kq4r_J1rtnEy2NZm8pCDk-cG
AUTH0_AUDIENCE=https://genai-4983036869979147.us.auth0.com/api/v2/

# 64 character random string to encrypt the session cookie
#
# We're generating a secret for your convenience, but for production,
# generate your own secret using `openssl rand -hex 32`
AUTH0_SECRET=caf30239d949bbd8ebf9a0fb6f20999f3a25348eb02a66d3977c23b95b41358d




backend .env

JWT_SECRET=9d97abc7f976477d76598349aac825b74662739c54b22d74b1ad07b45602bcb8
JWT_EXPIRATION=7d
EXCHANGERATE_API_KEY=402af2d747a0cb370f159942
PORT=3001
NODE_ENV=development

# Auth0 Configuration
AUTH0_DOMAIN=genai-4983036869979147.us.auth0.com
AUTH0_AUDIENCE=https://genai-4983036869979147.us.auth0.com/api/v2/

# Prisma Database URL
DATABASE_URL="postgresql://postgres:user@localhost:5432/trading_app_db?schema=public"
