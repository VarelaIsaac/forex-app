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