# Dokploy Environment Variables Setup

## ✅ Files Updated

Your Dockerfile and dokploy.yaml have been updated to properly handle environment variables.

## 🔧 How Environment Variables Work in Dokploy

For Next.js apps with `NEXT_PUBLIC_*` variables, you need to set them in **TWO places**:

1. **Build Arguments** - Available during `npm run build` (build time)
2. **Environment Variables** - Available when the app runs (runtime)

## 📋 Required Environment Variables

You need to set these **three** environment variables in Dokploy:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-instance.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
NEXT_PUBLIC_WEBHOOK_URL=https://mikeusdominus.app.n8n.cloud/webhook-test/proposal-writer
```

## 🚀 Setup Instructions in Dokploy

### Step 1: Open Your App in Dokploy

1. Go to your Dokploy dashboard
2. Click on your `tools` application
3. Navigate to the **Environment** tab

### Step 2: Add Environment Variables

Click **"Add Variable"** and add each of these:

| Key | Value | Example |
|-----|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | `eyJhbGci...` |
| `NEXT_PUBLIC_WEBHOOK_URL` | Your n8n webhook URL | `https://mikeusdominus.app.n8n.cloud/webhook-test/proposal-writer` |

### Step 3: Important - Check "Available at Build Time"

For **each** environment variable:
1. Click the **checkbox** or toggle for "Available at Build Time" or "Build Arg"
2. This ensures the variables are available during `npm run build`

### Step 4: Rebuild Your App

1. Click **"Redeploy"** or **"Rebuild"**
2. Dokploy will rebuild with the environment variables
3. Variables will be baked into the build

## 🔍 How It Works

### In Dockerfile:
```dockerfile
# Accept build arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_WEBHOOK_URL

# Set as environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_WEBHOOK_URL=$NEXT_PUBLIC_WEBHOOK_URL
```

### In dokploy.yaml:
```yaml
build:
  args:
    - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
    - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    - NEXT_PUBLIC_WEBHOOK_URL=${NEXT_PUBLIC_WEBHOOK_URL}
environment:
  - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
  - NEXT_PUBLIC_WEBHOOK_URL=${NEXT_PUBLIC_WEBHOOK_URL}
```

## ⚠️ Important Notes

### Why Both Build Args and Environment Variables?

1. **Build Args (`args`)**: 
   - Used during `npm run build`
   - Bakes values into the JavaScript bundles
   - Required for `NEXT_PUBLIC_*` variables

2. **Environment Variables (`environment`)**:
   - Used during runtime
   - Available in the running container
   - Good practice to set both

### Security Notes

- ✅ `NEXT_PUBLIC_*` variables are exposed to the browser
- ✅ These are safe to expose (they're public keys)
- ⚠️ **Never** put secret keys in `NEXT_PUBLIC_*` variables
- ⚠️ **Never** commit `.env.local` to git

## 🧪 Verification

After redeploying, verify the variables are set:

1. **Check build logs** - You should see the variables during build
2. **Check browser console**:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   // Should print your Supabase URL
   ```
3. **Test sign-in** - Should connect to Supabase successfully

## 🔧 Troubleshooting

### Variables still not working?

1. **Check Dokploy UI** - Ensure "Build Arg" checkbox is enabled
2. **Rebuild completely** - Delete build cache and rebuild
3. **Check spelling** - Variable names are case-sensitive
4. **Check logs** - Look for build errors mentioning environment variables

### Can't connect to Supabase?

1. Verify the URL is correct (no trailing slash)
2. Verify the anon key is the **public anon key** (not service role)
3. Check your Supabase instance is accessible from Dokploy

### Webhook not working?

1. Verify the webhook URL is correct
2. Test the webhook URL manually with curl/Postman
3. Check n8n workflow is active

## 📝 Summary

**What to do in Dokploy:**
1. ✅ Go to Environment tab
2. ✅ Add the 3 environment variables
3. ✅ Enable "Build Arg" for each variable
4. ✅ Click Redeploy

**Files updated:**
- ✅ `Dockerfile` - Now accepts build arguments
- ✅ `dokploy.yaml` - Configured to pass build args

You're all set! Your environment variables should now work correctly in Dokploy! 🎉

