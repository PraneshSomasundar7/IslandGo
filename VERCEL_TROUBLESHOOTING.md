# Vercel API Key Troubleshooting

## Error: "Server configuration error: API key not set"

This error means Vercel can't find the `ANTHROPIC_API_KEY` environment variable. Here's how to fix it:

## ✅ Step-by-Step Fix

### Step 1: Verify Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Look for `ANTHROPIC_API_KEY`
5. Verify:
   - ✅ Name is exactly: `ANTHROPIC_API_KEY` (case-sensitive, no spaces)
   - ✅ Value is your actual API key (starts with `sk-ant-api03-`)
   - ✅ It's enabled for **Production** environment (check the checkbox)

### Step 2: Check All Environments

Make sure the variable is set for:
- ✅ **Production** (for your live site)
- ✅ **Preview** (for preview deployments)
- ✅ **Development** (for local development)

**Important:** Even if you only use Production, enable it for all three to avoid issues.

### Step 3: Redeploy Your Application

**This is crucial!** After adding/changing environment variables, you MUST redeploy:

#### Option A: Automatic Redeploy
- Vercel should auto-redeploy, but wait a few minutes
- Check Deployments tab to see if a new deployment started

#### Option B: Manual Redeploy
1. Go to **Deployments** tab
2. Click the **"..."** menu (three dots) on the latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete (1-2 minutes)

### Step 4: Verify After Redeploy

1. Wait for deployment to finish (status should be "Ready")
2. Visit your site again
3. Try the Content Gaps page again
4. The error should be gone

## 🔍 Common Issues & Solutions

### Issue 1: Variable Not Set for Production

**Symptom:** Works locally but not in production

**Solution:**
- In Vercel → Settings → Environment Variables
- Find `ANTHROPIC_API_KEY`
- Make sure **Production** checkbox is checked
- Redeploy

### Issue 2: Typo in Variable Name

**Symptom:** Variable exists but still getting error

**Solution:**
- Variable name must be exactly: `ANTHROPIC_API_KEY`
- Check for:
  - Extra spaces
  - Wrong capitalization
  - Missing underscores
- Delete and recreate the variable if needed

### Issue 3: Old Deployment Still Running

**Symptom:** Added variable but still seeing error

**Solution:**
- The deployment that's live was built BEFORE you added the variable
- You MUST redeploy after adding environment variables
- Go to Deployments → Redeploy latest

### Issue 4: API Key Value is Wrong

**Symptom:** Variable exists but API calls fail

**Solution:**
- Verify your API key is correct
- Should start with: `sk-ant-api03-`
- Get a fresh key from [Anthropic Console](https://console.anthropic.com/)
- Update the variable in Vercel
- Redeploy

## 🧪 Quick Test

After redeploying, test if it's working:

1. Visit: `https://your-app.vercel.app/api/db/test`
   - Should return JSON with `"success": true`

2. Visit: `https://your-app.vercel.app/creator-recruitment`
   - Enter a city
   - Click "Find Creators"
   - Should work without errors

## 📋 Checklist

Before asking for help, verify:

- [ ] `ANTHROPIC_API_KEY` exists in Vercel Environment Variables
- [ ] Variable name is exactly `ANTHROPIC_API_KEY` (no typos)
- [ ] Value is a valid Anthropic API key
- [ ] **Production** environment is checked/enabled
- [ ] You've redeployed after adding the variable
- [ ] Latest deployment shows "Ready" status
- [ ] You've waited 1-2 minutes after redeploy

## 🚨 Still Not Working?

If you've done all the above and it still doesn't work:

1. **Check Deployment Logs:**
   - Go to Deployments → Latest → View Logs
   - Look for any errors during build

2. **Check Function Logs:**
   - Go to Deployments → Latest → Functions
   - Check for runtime errors

3. **Verify API Key Format:**
   - Should be: `sk-ant-api03-` followed by long string
   - No quotes, no spaces
   - Full key copied (they're very long)

4. **Try Creating a New API Key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Create a new key
   - Update in Vercel
   - Redeploy

## 💡 Pro Tip

After adding environment variables in Vercel:
1. Always check the Deployments tab
2. Wait for a new deployment to start automatically
3. Or manually trigger a redeploy
4. Environment variables only apply to NEW deployments

---

**Remember:** Environment variables are only available to functions that run AFTER the deployment where the variable was added. Old deployments won't have access to new variables!

