# API Setup Guide

This application uses the **Anthropic Claude API** for AI-powered features. Here's how to set it up:

## 🔑 Getting Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **"Create Key"**
5. Copy your API key (you'll only see it once!)

## 💻 Local Development Setup

### Step 1: Create Environment File

Create a `.env.local` file in the root of your project:

```bash
# In the project root directory
touch .env.local
```

### Step 2: Add Your API Key

Open `.env.local` and add:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-api-key-here
```

**Important Notes:**
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Replace `your-actual-api-key-here` with your actual API key
- The key should start with `sk-ant-api03-`

### Step 3: Restart Development Server

After adding the API key, restart your dev server:

```bash
npm run dev
```

## ☁️ Vercel Deployment Setup

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key
   - **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**
7. Redeploy your application (or it will auto-deploy on next push)

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variable
vercel env add ANTHROPIC_API_KEY

# Follow the prompts to enter your API key
# Select environments: Production, Preview, Development

# Redeploy
vercel --prod
```

## 🔍 Verifying Your Setup

### Check if API Key is Loaded

1. Start your dev server: `npm run dev`
2. Open browser console (F12)
3. Try using any AI feature (Creator Recruitment, Content Gaps, or Viral Content)
4. Check the Network tab for API calls

### Test the API Connection

Visit: `http://localhost:3000/api/db/test`

If you see a success message, your database is connected. To test the AI API:

1. Go to Creator Recruitment page
2. Enter a city name (e.g., "Austin, TX")
3. Click "Find Creators"
4. If it works, you'll see creator profiles

## ⚠️ Troubleshooting

### Error: "API key not set"

**Solution:**
- Make sure `.env.local` exists in the project root
- Verify the variable name is exactly `ANTHROPIC_API_KEY`
- Restart your dev server after adding the key
- Check for typos in the API key

### Error: "Invalid API key"

**Solution:**
- Verify your API key is correct
- Make sure you copied the entire key (they're long!)
- Check if your Anthropic account has credits/quota
- Ensure the key hasn't expired or been revoked

### Error: "Server configuration error"

**Solution:**
- In Vercel: Check Environment Variables in Settings
- Make sure the variable is set for the correct environment
- Redeploy after adding environment variables

### API Not Working in Production

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `ANTHROPIC_API_KEY` is set
3. Make sure it's enabled for "Production" environment
4. Click "Redeploy" to apply changes

## 🔐 Security Best Practices

1. **Never commit API keys to git**
   - `.env.local` is already in `.gitignore`
   - Never share API keys in code, issues, or pull requests

2. **Use different keys for different environments**
   - Development: Use a test key
   - Production: Use your main key

3. **Rotate keys regularly**
   - If a key is compromised, revoke it immediately
   - Generate a new key from Anthropic Console

4. **Monitor API usage**
   - Check Anthropic Console for usage and billing
   - Set up usage alerts if available

## 📊 API Usage

The application uses the Anthropic API for:

- **Creator Recruitment**: Generates realistic creator profiles
- **Content Gap Analysis**: Analyzes geographic content gaps
- **Viral Content Generation**: Creates engaging social media content

All API calls are made server-side (in `/api/ai/route.ts`) to keep your API key secure.

## 💰 Pricing

Check [Anthropic Pricing](https://www.anthropic.com/pricing) for current rates. The demo uses Claude 3.5 Sonnet model.

## 📝 Example `.env.local` File

```env
# Anthropic API Key (required)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Base URL for SEO (used in sitemap and metadata)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# Optional: Google Search Console Verification
GOOGLE_VERIFICATION=your-verification-code
```

## 🆘 Need Help?

- Check [Anthropic Documentation](https://docs.anthropic.com/)
- Review server logs in Vercel Dashboard
- Check browser console for client-side errors
- Verify environment variables are set correctly

