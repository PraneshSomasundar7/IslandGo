# How to Check Vercel Function Logs

## 📍 Step-by-Step Guide

### Step 1: Go to Your Vercel Dashboard

1. Open your browser
2. Go to: https://vercel.com/dashboard
3. Log in if needed

### Step 2: Select Your Project

1. You'll see a list of your projects
2. Click on your **IslandGo** project (or whatever you named it)

### Step 3: Go to Deployments Tab

1. At the top of the page, you'll see tabs like:
   - **Overview**
   - **Deployments** ← Click this one
   - **Analytics**
   - **Settings**
   - etc.

2. Click on **"Deployments"**

### Step 4: Find the Latest Deployment

1. You'll see a list of deployments (most recent at the top)
2. Each deployment shows:
   - Status (Ready, Building, Error, etc.)
   - Commit message
   - Time (e.g., "2 minutes ago")
   - Branch name

3. Click on the **latest deployment** (the one at the top)

### Step 5: View Deployment Details

After clicking the deployment, you'll see:
- Build logs
- Function logs
- Environment variables used
- Build time
- etc.

### Step 6: Access Function Logs

You have two ways to see function logs:

#### Option A: From Deployment Page

1. On the deployment details page, look for:
   - **"Functions"** tab or section
   - Or a list of functions

2. You should see functions like:
   - `/api/ai`
   - `/api/analytics`
   - `/api/data/creators`
   - etc.

3. Click on **`/api/ai`**

#### Option B: From Logs Section

1. On the deployment page, look for:
   - **"Logs"** or **"View Logs"** button
   - Or a **"Runtime Logs"** section

2. Click on it
3. You'll see logs from all functions
4. Filter or search for `/api/ai` logs

### Step 7: Read the Error Messages

In the logs, you'll see:

1. **Timestamps** - When each log entry was created
2. **Log levels** - INFO, ERROR, WARN, etc.
3. **Messages** - The actual log messages

**Look for:**
- Lines with **ERROR** in red
- Stack traces (lines of code)
- Error messages like:
  - "Error in handleRecruitCreators"
  - "Failed to parse JSON"
  - "API timeout"
  - "Invalid API key"
  - etc.

### Step 8: Copy the Error

1. Find the error message
2. Select and copy it (Ctrl+C / Cmd+C)
3. Share it so we can help fix it!

## 🔍 What to Look For

### Common Error Patterns:

1. **Authentication Errors:**
   ```
   Error: Invalid API key
   Error: 401 Unauthorized
   ```

2. **Timeout Errors:**
   ```
   Error: Function execution timed out
   Error: Request timeout
   ```

3. **JSON Parsing Errors:**
   ```
   Error: Unexpected token in JSON
   Error: Failed to parse response
   ```

4. **Network Errors:**
   ```
   Error: Network request failed
   Error: Connection timeout
   ```

## 📸 Visual Guide

The navigation path is:
```
Vercel Dashboard
  → Your Project
    → Deployments Tab
      → Latest Deployment (click it)
        → Functions Section
          → /api/ai (click it)
            → Logs (read here!)
```

## 🚨 If You Can't Find Logs

### Alternative: Check Build Logs

1. On the deployment page
2. Look for **"Build Logs"** or **"View Build Logs"**
3. Click it
4. Scroll through to find errors

### Alternative: Check Runtime Logs

1. On the deployment page
2. Look for **"Runtime Logs"** or **"Function Logs"**
3. Click it
4. Filter by function name: `/api/ai`

## 💡 Pro Tips

1. **Use the search/filter** - Most log viewers have a search box
   - Search for: "error", "failed", "exception"

2. **Check recent logs** - Errors are usually at the bottom
   - Scroll down to see the most recent entries

3. **Look for stack traces** - They show exactly where the error occurred
   - Usually multiple lines starting with "at ..."

4. **Check timestamps** - Match them with when you tested
   - If you tested at 2:30 PM, look for logs around that time

## 🎯 Quick Checklist

- [ ] Went to vercel.com/dashboard
- [ ] Selected my project
- [ ] Clicked "Deployments" tab
- [ ] Clicked latest deployment
- [ ] Found Functions section
- [ ] Clicked `/api/ai`
- [ ] Found error messages in logs
- [ ] Copied the error message

## 📋 What to Share

Once you find the error, share:
1. **The error message** (exact text)
2. **When it happened** (timestamp)
3. **What you were doing** (e.g., "trying Creator Recruitment")

This will help identify the exact issue!

---

**Still can't find it?** Try this:
1. Go to your project Settings
2. Click "Logs" or "Monitoring"
3. Look for real-time logs there

