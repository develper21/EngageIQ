# Backend Migration to Next.js API

I have restructured your application to follow the "Proper" Next.js full-stack architecture, removing the need for a separate Express server.

## 📂 New Structure
- **Frontend & Backend in One**: All API logic is now designed to live in `src/app/api`.
- **Database**: Prisma is now configured in the root directory.

## 🚀 How to Enable the Real Backend
Currently, the backend logic is parked in `backend_migration_pending` to prevent build errors while you set up your database.

### Step 1: Configure Database
1. Open `.env.local` (or create `.env`) and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/engageiq?schema=public"
   JWT_SECRET="your-secret-key"
   ```

### Step 2: Enable the Code
1. Rename `src/lib/db.ts.example` to `src/lib/db.ts`.
2. Rename `src/lib/auth.ts.example` to `src/lib/auth.ts`.
3. Move the API folder back to the app directory:
   ```bash
   mv backend_migration_pending src/app/api
   ```

### Step 3: Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### Step 4: Restart Server
```bash
npm run dev
```

Your modules (`Overview`, `Insights`) are currently using mock data. You can update them to `fetch('/api/analytics/overview')` once the backend is active.
