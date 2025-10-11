# Environment Variables Setup

Create a `.env.local` file in the root directory with these variables:

```bash
# Supabase Configuration
# Replace these with your self-hosted Supabase instance values

# Your self-hosted Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-instance.com

# Your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Optional: Service role key (keep this secret, only use server-side)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Where to find these values:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your self-hosted Supabase instance URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Found in your Supabase dashboard under Settings > API
3. **SUPABASE_SERVICE_ROLE_KEY**: (Optional) For server-side operations, also in API settings

## Important Notes:

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Service role key should NEVER be exposed to the browser
- Restart your dev server after adding environment variables

