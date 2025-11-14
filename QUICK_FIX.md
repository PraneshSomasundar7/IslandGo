# Quick Fix: API Key Not Set Error

## ⚠️ The Problem
You're seeing "Server configuration error: API key not set" even though you added the variable in Vercel.

## ✅ The Solution (Do These Steps in Order)

### Step 1: Double-Check Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Look for `ANTHROPIC_API_KEY`
5. **VERIFY:**
   - ✅ Name is EXACTLY: `ANTHROPIC_API_KEY` (no spaces, case-sensitive)
   - ✅ Value is your API key (starts with `sk-ant-api03-`)
   - ✅ **Production** checkbox is CHECKED (this is critical!)
   - ✅ **Preview** checkbox is CHECKED
   - ✅ **Development** checkbox is CHECKED

### Step 2: Delete and Re-add (If Needed)

If the variable looks wrong:
1. Click the **trash icon** to delete it
2. Click **"Add New"**
3. Name: `ANTHROPIC_API_KEY` (exact, no spaces)
4. Value: Paste your full API key
5. Check ALL three environments: Production, Preview, Development
6. Click **"Save"**

### Step 3: FORCE A REDEPLOY

**This is the most important step!**

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. **IMPORTANT:** Make sure "Use existing Build Cache" is **UNCHECKED**
6. Click **"Redeploy"**
7. Wait 2-3 minutes for it to complete

### Step 4: Verify the Redeploy

1. Wait until deployment status shows **"Ready"** (green checkmark)
2. Click on the deployment to see details
3. Check the **"Environment Variables"** section
4. You should see `ANTHROPIC_API_KEY` listed there

### Step 5: Test Again

1. Go to your live site
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try Creator Recruitment or Content Gaps again
4. Error should be gone!

## 🔍 Still Not Working? Check These:

### Check 1: Variable Name Typo
- Must be: `ANTHROPIC_API_KEY`
- NOT: `ANTHROPIC_API_KEY ` (with space)
- NOT: `anthropic_api_key` (wrong case)
- NOT: `ANTHROPIC-API-KEY` (wrong separator)

### Check 2: API Key Format
- Should start with: `sk-ant-api03-`
- Should be very long (100+ characters)
- No quotes around it
- No extra spaces

### Check 3: Deployment Logs
1. Go to Deployments → Latest → View Logs
2. Look for any errors
3. Check if environment variables are being loaded

### Check 4: Function Logs
1. Go to Deployments → Latest → Functions
2. Click on `/api/ai` function
3. Check logs for errors
4. Look for "ANTHROPIC_API_KEY is not set" message

## 🚨 Nuclear Option: Full Reset

If nothing works:

1. **Delete the variable completely**
2. **Wait 30 seconds**
3. **Add it again** with exact name: `ANTHROPIC_API_KEY`
4. **Check all three environments**
5. **Redeploy WITHOUT build cache**
6. **Wait for completion**
7. **Test again**

## 💡 Why This Happens

Environment variables are only available to NEW deployments. If you:
- Added the variable AFTER deployment
- Didn't redeploy
- Used cached build

Then the old deployment doesn't have access to the variable!

## ✅ Success Indicators

You'll know it's working when:
- ✅ Deployment shows "Ready"
- ✅ No errors in deployment logs
- ✅ Creator Recruitment page works
- ✅ Content Gaps page works
- ✅ No "API key not set" error

---

**Most Common Issue:** Not redeploying after adding the variable. The deployment that's live was built BEFORE you added the variable, so it doesn't have access to it!

