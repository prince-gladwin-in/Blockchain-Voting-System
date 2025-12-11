# 🚀 Quick Activation Guide - Automated Deployment

## ⚡ Fast Track (5 Minutes)

### Step 1: Get Your Tokens (2 minutes)

#### Vercel Tokens:
1. **VERCEL_TOKEN**: https://vercel.com/account/tokens → Create Token → Copy
2. **VERCEL_ORG_ID**: Vercel Dashboard → Your Project → Settings → General → Copy "Organization ID"
3. **VERCEL_PROJECT_ID**: Same page → Copy "Project ID"

#### Railway Tokens:
1. **RAILWAY_TOKEN**: https://railway.app/account → New Token → Copy
2. **RAILWAY_SERVICE_ID**: Railway Dashboard → Your Service → Copy from URL or Settings

### Step 2: Add GitHub Secrets (3 minutes)

**Go to:** https://github.com/Gabimaru123/Blockchain-Voting-System/settings/secrets/actions

**Click "New repository secret" and add these 7 secrets:**

| Secret Name | Value | Where to Get |
|------------|-------|--------------|
| `VERCEL_TOKEN` | Your Vercel token | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Your Org ID | Vercel Project Settings → General |
| `VERCEL_PROJECT_ID` | Your Project ID | Vercel Project Settings → General |
| `RAILWAY_TOKEN` | Your Railway token | railway.app/account → New Token |
| `RAILWAY_SERVICE_ID` | Your Service ID | Railway Service Settings |
| `REACT_APP_API_URL` | `https://your-backend.railway.app` | Your Railway backend URL |
| `REACT_APP_BLOCKCHAIN_NETWORK_ID` | `31337` | Your blockchain network ID |

### Step 3: Test It! (1 minute)

```bash
# Make a small change
echo "// Test" >> frontend/src/App.js

# Commit and push
git add .
git commit -m "Test automated deployment"
git push origin main
```

**Then check:**
- GitHub → Actions tab → See workflow running ✅
- Vercel Dashboard → See new deployment ✅

## ✅ That's It!

Once secrets are added, **every push to `main` will automatically deploy!**

---

## 📋 Detailed Checklist

See `DEPLOYMENT_ACTIVATION_CHECKLIST.md` for a complete step-by-step checklist.

## 📚 Full Documentation

See `AUTOMATED_DEPLOYMENT.md` for comprehensive documentation.

## 🆘 Need Help?

1. **Workflows not running?** → Check GitHub Actions is enabled in repo settings
2. **Deployment fails?** → Check GitHub Actions logs for errors
3. **Secrets not working?** → Verify secret names match exactly (case-sensitive!)

---

**🎉 Once all 7 secrets are added, your automation is ACTIVE!**

