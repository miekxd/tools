# Setup Guide - Authentication & User Separation

## ✅ What's Been Implemented

Your tools website now has complete authentication and user separation! Here's what's new:

### 🔐 Authentication System
- **Sign In / Sign Up** pages with email/password
- **Email verification** workflow
- **Protected routes** - Tools require authentication
- **Session management** with Supabase Auth
- **Public landing page** for unauthenticated users

### 👤 User Separation
- **User-specific data** - Each user only sees their own tasks
- **Row-level security** in database
- **User profile** in sidebar with email and sign-out button
- **Automatic profile creation** on signup

### 🗄️ Database Integration
- **Task Manager** now saves to Supabase database
- **Real-time data persistence** across sessions
- **Multi-user support** with complete data isolation

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/ssr` - Supabase SSR client
- `@supabase/supabase-js` - Supabase JavaScript client

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the values from your Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-instance.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Open your self-hosted Supabase dashboard
2. Go to **Settings** > **API**
3. Copy the **URL** and **anon public** key

### Step 3: Set Up Database

Open your Supabase SQL Editor and run the SQL from `DATABASE_SCHEMA.md`:

```sql
-- This creates the tasks table with RLS policies
-- See DATABASE_SCHEMA.md for the complete SQL
```

The database schema includes:
- ✅ `tasks` table for Task Manager
- ✅ Row-level security policies
- ✅ Automatic timestamps
- ✅ User data isolation

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Test the System

1. **Visit the landing page** - You'll see a public homepage
2. **Click "Sign Up"** - Create a new account
3. **Check your email** - Verify your account
4. **Sign In** - Log in with your credentials
5. **Use Task Manager** - Add, complete, and delete tasks
6. **Sign Out** - Test the sign-out functionality

## 📁 Project Structure

```
app/
├── page.tsx                      # Public landing page
├── sign-in/
│   └── page.tsx                 # Sign in page
├── sign-up/
│   └── page.tsx                 # Sign up page
├── auth/
│   └── callback/
│       └── route.ts             # Auth callback handler
└── tools/
    ├── proposal-writer/         # Protected tool
    ├── csv-processor/           # Protected tool
    └── task-manager/            # Protected tool (now with DB)

lib/
└── supabase/
    ├── client.ts                # Browser Supabase client
    ├── server.ts                # Server Supabase client
    └── middleware.ts            # Auth middleware

middleware.ts                     # Route protection

components/
└── ToolSidebar.tsx              # Sidebar with user profile
```

## 🔒 How Authentication Works

### Public Routes
- `/` - Landing page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/auth/callback` - Auth callback

### Protected Routes
- `/tools/*` - All tools require authentication
- Automatically redirects to `/sign-in` if not authenticated

### Middleware Protection
The `middleware.ts` file checks authentication on every request and:
1. ✅ Refreshes the user session
2. ✅ Redirects to `/sign-in` if not authenticated
3. ✅ Allows access to public routes
4. ✅ Protects all `/tools/*` routes

## 🗄️ Database Security

### Row-Level Security (RLS)
Every table has RLS policies that ensure:
- ✅ Users can only see their own data
- ✅ Users can only modify their own data
- ✅ Data is completely isolated per user

### Example Policy (Tasks Table)
```sql
-- Users can only view their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);
```

## 🎨 UI Features

### Landing Page
- Hero section with CTAs
- Features showcase
- Sign up / Sign in buttons

### Auth Pages
- Clean, modern design
- Email/password forms
- Error handling
- Success states
- Links between sign-in/sign-up

### Sidebar
- User profile with email
- User avatar (first letter of email)
- Sign out button
- Tool navigation

### Task Manager
- Real-time database sync
- Add/edit/delete tasks
- Mark as complete
- Filter by status
- Stats dashboard
- Beautiful purple gradient theme

## 🔧 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Can't connect to Supabase
- Check your `.env.local` file
- Verify the URL and anon key are correct
- Restart the dev server

### Tasks not saving
- Check if the `tasks` table exists in Supabase
- Verify RLS policies are enabled
- Check browser console for errors

### Not redirecting after sign in
- Clear browser cookies
- Check middleware.ts is running
- Verify auth callback route exists

### Users can see other users' tasks
- Check RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'tasks';`
- Ensure policies check `auth.uid() = user_id`

## 📝 Next Steps

### Add More Tools
Each tool can now have user-specific data:
1. Create a new table in Supabase
2. Add RLS policies
3. Update the tool to use the database

### Add OAuth Providers
Enable Google, GitHub, etc. in Supabase:
1. Go to **Authentication** > **Providers**
2. Enable desired providers
3. Add OAuth buttons to sign-in page

### Add User Profiles
Store additional user data:
- Full name
- Avatar URL
- Preferences
- Settings

## 🎉 You're All Set!

Your tools website now has:
- ✅ Complete authentication system
- ✅ User separation and data isolation
- ✅ Protected routes
- ✅ Database integration
- ✅ Beautiful landing page
- ✅ User profile management

Users can now sign up, sign in, and have their own private tool data!

