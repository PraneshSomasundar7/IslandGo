# Debugging "Internal Server Error"

## ✅ Good News
The error changed from "API key not set" to "Internal server error" - this means:
- ✅ Your API key is being read correctly
- ✅ The environment variable is working
- ❌ But something else is failing in the API call

## 🔍 How to Find the Real Error

### Step 1: Check Vercel Function Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments** tab
3. Click on the **latest deployment**
4. Click **"Functions"** tab
5. Find `/api/ai` function
6. Click on it to see logs
7. Look for error messages (they'll be in red)

**This will show you the actual error!**

### Step 2: Check Deployment Logs

1. In the same deployment view
2. Click **"View Logs"** or **"Build Logs"**
3. Scroll through to find any errors
4. Look for stack traces or error messages

## 🐛 Common Causes & Fixes

### Issue 1: Invalid API Key

**Symptoms:**
- Error mentions "authentication" or "401"
- Error mentions "invalid API key"

**Solution:**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Verify your API key is active
3. Check if you have credits/quota
4. Generate a new key if needed
5. Update in Vercel → Redeploy

### Issue 2: API Rate Limit

**Symptoms:**
- Error mentions "rate limit" or "429"
- Works sometimes but fails other times

**Solution:**
- Wait a few minutes and try again
- Check your Anthropic account usage
- Upgrade plan if needed

### Issue 3: Network/Timeout Error

**Symptoms:**
- Error mentions "timeout" or "network"
- Takes long time then fails

**Solution:**
- Check Anthropic API status
- Try again (might be temporary)
- Check Vercel function timeout settings

### Issue 4: JSON Parsing Error

**Symptoms:**
- Error in logs about "JSON.parse" or "invalid JSON"
- API returns unexpected format

**Solution:**
- This is a code issue
- The AI response might be malformed
- Check function logs for details

### Issue 5: Missing Dependencies

**Symptoms:**
- Error mentions "module not found"
- Error about missing packages

**Solution:**
- Check `package.json` has all dependencies
- Redeploy to ensure packages are installed

## 🔧 Quick Fixes to Try

### Fix 1: Verify API Key is Valid

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Check your API key is active
3. Test it manually (if you have access)
4. Make sure you have credits

### Fix 2: Check Function Timeout

Vercel has function timeouts. If the AI call takes too long:
- Check function logs for timeout errors
- The default timeout might be too short
- Consider increasing timeout in `vercel.json`

### Fix 3: Add Better Error Logging

The API route should log more details. Check the logs to see what's actually failing.

## 📋 What to Check in Logs

When you check Vercel function logs, look for:

1. **Error messages** - The actual error text
2. **Stack traces** - Where the error occurred
3. **Request details** - What was sent to the API
4. **Response details** - What came back (if anything)

## 🚨 Most Likely Issues

Based on "Internal server error", the most common causes are:

1. **Invalid API Key** (40% chance)
   - Key might be wrong or expired
   - Check Anthropic Console

2. **API Timeout** (30% chance)
   - AI call takes too long
   - Check function timeout settings

3. **API Response Parsing** (20% chance)
   - AI returns unexpected format
   - Check logs for JSON errors

4. **Network Issues** (10% chance)
   - Temporary Anthropic API issue
   - Try again later

## ✅ Next Steps

1. **Check Vercel Function Logs** (most important!)
   - This will show the real error
   - Copy the error message

2. **Share the Error Message**
   - Once you see the actual error in logs
   - We can provide a specific fix

3. **Try a Different Feature**
   - Test Creator Recruitment
   - Test Content Gaps
   - See if error is consistent

## 💡 Pro Tip

The function logs in Vercel are your best friend! They show exactly what's happening server-side. Always check them first when debugging.

---

**Action Required:** Go to Vercel → Deployments → Latest → Functions → `/api/ai` → Check the logs and share what error you see!

