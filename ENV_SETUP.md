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

# Stock Price API (Alpha Vantage)
# Get your free API key at: https://www.alphavantage.co/support/#api-key
# Free tier: 5 API calls per minute, 500 per day
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key-here
```

## Where to find these values:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your self-hosted Supabase instance URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Found in your Supabase dashboard under Settings > API
3. **SUPABASE_SERVICE_ROLE_KEY**: (Optional) For server-side operations, also in API settings
4. **ALPHA_VANTAGE_API_KEY**: 
   - Go to https://www.alphavantage.co/support/#api-key
   - Fill out the form (name, email, purpose)
   - You'll receive your free API key via email
   - Free tier allows 5 calls/minute, 500 calls/day

## Important Notes:

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Service role key should NEVER be exposed to the browser
- **ALPHA_VANTAGE_API_KEY** is server-side only (not prefixed with NEXT_PUBLIC_)
- If you don't set ALPHA_VANTAGE_API_KEY, the app will fall back to Yahoo Finance (may hit rate limits)
- Restart your dev server after adding environment variables

