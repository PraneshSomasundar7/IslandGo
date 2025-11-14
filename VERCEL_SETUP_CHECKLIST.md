# Vercel Setup Checklist

## ✅ Environment Variables to Verify

### Required Variables:

1. **ANTHROPIC_API_KEY** ✅ (You've added this)
   - Used for AI features (Creator Recruitment, Content Gaps, Viral Content)
   - Should be set for: Production, Preview, Development

### Database Variables (Auto-added if database is connected):

If you connected Vercel Postgres, these should be automatically added:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Optional Variables:

- **NEXT_PUBLIC_BASE_URL** (Optional)
  - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
  - Used for SEO metadata and sitemap
  - If not set, defaults to `https://islandgo-ai-demo.vercel.app`

- **GOOGLE_VERIFICATION** (Optional)
  - For Google Search Console verification
  - Only needed if you want to verify your site with Google

## 🔍 How to Verify Your Setup

### Step 1: Check Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify you see:
   - ✅ `ANTHROPIC_API_KEY` (you added this)
   - ✅ Database variables (if Postgres is connected - should be auto-added)

### Step 2: Test Database Connection

Visit: `https://your-app.vercel.app/api/db/test`

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "tables": {
    "creators": { "count": 0, "sample": "Empty" },
    "gaps": { "count": 0, "sample": "Empty" },
    "viral_content": { "count": 0, "sample": "Empty" }
  }
}
```

### Step 3: Test AI API

1. Go to: `https://your-app.vercel.app/creator-recruitment`
2. Enter a city (e.g., "Austin, TX")
3. Click "Find Creators"
4. If it works, you'll see creator profiles (API is working!)

### Step 4: Check Deployment Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the "Build Logs" for any errors
4. Check "Function Logs" for runtime errors

## 🚀 Next Steps After Adding Environment Variables

### Option 1: Automatic Redeploy (Recommended)

If you just added environment variables:
- Vercel will automatically trigger a new deployment
- Wait for it to complete (usually 1-2 minutes)
- Check the deployment status

### Option 2: Manual Redeploy

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the "..." menu on the latest deployment
3. Select "Redeploy"
4. Wait for deployment to complete

## ✅ Verification Checklist

- [ ] `ANTHROPIC_API_KEY` is set in Vercel
- [ ] Environment variables are set for all environments (Production, Preview, Development)
- [ ] Database variables are present (if using Postgres)
- [ ] Latest deployment completed successfully
- [ ] Test database connection: `/api/db/test` works
- [ ] Test AI features: Creator Recruitment works
- [ ] No errors in deployment logs

## 🐛 Troubleshooting

### Issue: "API key not set" error

**Solution:**
- Double-check the variable name is exactly `ANTHROPIC_API_KEY` (case-sensitive)
- Make sure it's enabled for the environment you're testing (Production/Preview)
- Redeploy after adding the variable

### Issue: Database connection fails

**Solution:**
- Verify Postgres database is connected in Vercel Dashboard → Storage
- Check that database variables are present in Environment Variables
- Database tables are created automatically on first use

### Issue: Build fails

**Solution:**
- Check build logs in Vercel Dashboard
- Verify all dependencies are in `package.json`
- Check for TypeScript errors locally: `npm run type-check`

### Issue: Features not working in production

**Solution:**
- Verify environment variables are set for "Production" environment
- Check function logs in Vercel Dashboard
- Test the API endpoints directly: `/api/ai`, `/api/db/test`

## 📊 Monitoring

After deployment, you can monitor:

1. **Vercel Analytics**: Automatic performance tracking
2. **Function Logs**: Check for API errors
3. **Deployment Logs**: Check for build issues

## 🎉 Success Indicators

Your setup is complete when:
- ✅ All environment variables are set
- ✅ Deployment succeeds without errors
- ✅ Database test endpoint returns success
- ✅ AI features work (can generate creators/content)
- ✅ Analytics page loads and shows data

---

**Need Help?** Check the deployment logs in Vercel Dashboard for specific error messages.

