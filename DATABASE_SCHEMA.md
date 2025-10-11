# Database Schema

This document describes the database schema for your self-hosted Supabase instance.

## Required Setup

Run these SQL commands in your Supabase SQL Editor to create the necessary tables and security policies.

## Tables

### 1. Tasks Table

For the Task Manager tool to store user tasks.

```sql
-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_created_at_idx ON tasks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. User Profiles Table (Optional)

For storing additional user information beyond what Supabase Auth provides.

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 3. Tool History Table (Optional)

For storing execution history of webhook-based tools.

```sql
-- Create tool_history table
CREATE TABLE tool_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX tool_history_user_id_idx ON tool_history(user_id);
CREATE INDEX tool_history_tool_id_idx ON tool_history(tool_id);
CREATE INDEX tool_history_created_at_idx ON tool_history(created_at DESC);

-- Enable RLS
ALTER TABLE tool_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "Users can view their own history"
  ON tool_history FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own history
CREATE POLICY "Users can insert their own history"
  ON tool_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Setup Instructions

1. **Open your Supabase Dashboard**
2. **Go to SQL Editor**
3. **Create a new query**
4. **Copy and paste the SQL from above**
5. **Run the query**

## Verification

After running the SQL, verify the tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tasks', 'profiles', 'tool_history');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tasks', 'profiles', 'tool_history');
```

## Important Security Notes

- ✅ **Row Level Security (RLS)** is enabled on all tables
- ✅ Users can only access their own data
- ✅ All policies check `auth.uid()` to ensure user separation
- ✅ Foreign key constraints ensure data integrity

## Next Steps

After creating the database schema:

1. Update your `.env.local` with your Supabase credentials
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Sign up for a new account
5. Start using the Task Manager!

## Troubleshooting

### Users can't see their tasks
- Check if RLS is enabled: `ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;`
- Verify policies exist: `SELECT * FROM pg_policies WHERE tablename = 'tasks';`

### Profile not created automatically
- Check if the trigger exists and is enabled
- Manually create a profile: `INSERT INTO profiles (id, email) VALUES ('user-id', 'user@email.com');`

### Permission denied errors
- Ensure the user is authenticated
- Check if the policies are correctly configured
- Verify `auth.uid()` matches the user_id in the table

