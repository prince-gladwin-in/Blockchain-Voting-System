# Activation Script for Automated Deployment
# This script helps you set up and activate automated deployments

Write-Host "🚀 Automated Deployment Activation Script" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

$step = 1

# Step 1: Check Git Setup
Write-Host "[$step] Checking Git configuration..." -ForegroundColor Yellow
$step++
try {
    $gitRemote = git remote get-url origin 2>$null
    if ($gitRemote) {
        Write-Host "✅ Git remote configured: $gitRemote" -ForegroundColor Green
    } else {
        Write-Host "❌ No Git remote found. Please configure: git remote add origin <your-repo-url>" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Git not properly configured" -ForegroundColor Red
    exit 1
}

# Step 2: Check GitHub Repository
Write-Host "`n[$step] Verifying GitHub repository access..." -ForegroundColor Yellow
$step++
$repoUrl = $gitRemote -replace '\.git$', ''
$repoUrl = $repoUrl -replace 'git@github\.com:', 'https://github.com/'
Write-Host "📦 Repository: $repoUrl" -ForegroundColor Blue
Write-Host "   Please verify you can access this repository in your browser." -ForegroundColor Gray
$continue = Read-Host "   Can you access this repository? (y/n)"
if ($continue -ne 'y') {
    Write-Host "❌ Please fix repository access first" -ForegroundColor Red
    exit 1
}

# Step 3: Vercel Setup Instructions
Write-Host "`n[$step] Vercel Configuration (Frontend)" -ForegroundColor Yellow
$step++
Write-Host "`n📋 Follow these steps to get your Vercel tokens:" -ForegroundColor Cyan
Write-Host "   1. Go to: https://vercel.com/account/tokens" -ForegroundColor White
Write-Host "   2. Click 'Create Token'" -ForegroundColor White
Write-Host "   3. Name it 'GitHub Actions' and set expiration (or never)" -ForegroundColor White
Write-Host "   4. Copy the token" -ForegroundColor White
Write-Host ""
Write-Host "   5. Go to your Vercel project dashboard" -ForegroundColor White
Write-Host "   6. Go to Settings → General" -ForegroundColor White
Write-Host "   7. Copy 'Project ID' and 'Organization ID'" -ForegroundColor White
Write-Host ""
$vercelToken = Read-Host "   Paste your VERCEL_TOKEN here (or press Enter to skip)"
$vercelOrgId = Read-Host "   Paste your VERCEL_ORG_ID here (or press Enter to skip)"
$vercelProjectId = Read-Host "   Paste your VERCEL_PROJECT_ID here (or press Enter to skip)"

# Step 4: Railway Setup Instructions
Write-Host "`n[$step] Railway Configuration (Backend)" -ForegroundColor Yellow
$step++
Write-Host "`n📋 Follow these steps to get your Railway tokens:" -ForegroundColor Cyan
Write-Host "   1. Go to: https://railway.app/account" -ForegroundColor White
Write-Host "   2. Click 'New Token'" -ForegroundColor White
Write-Host "   3. Name it 'GitHub Actions' and copy the token" -ForegroundColor White
Write-Host ""
Write-Host "   4. Go to your Railway project" -ForegroundColor White
Write-Host "   5. Click on your backend service" -ForegroundColor White
Write-Host "   6. Copy the Service ID from the URL or Settings" -ForegroundColor White
Write-Host ""
$railwayToken = Read-Host "   Paste your RAILWAY_TOKEN here (or press Enter to skip)"
$railwayServiceId = Read-Host "   Paste your RAILWAY_SERVICE_ID here (or press Enter to skip)"

# Step 5: Environment Variables
Write-Host "`n[$step] Environment Variables" -ForegroundColor Yellow
$step++
Write-Host "`n📋 Configure these environment variables:" -ForegroundColor Cyan
$reactAppApiUrl = Read-Host "   REACT_APP_API_URL (your backend URL, e.g., https://your-backend.railway.app)"
$blockchainNetworkId = Read-Host "   REACT_APP_BLOCKCHAIN_NETWORK_ID (e.g., 31337)"

# Step 6: Generate GitHub Secrets Setup Instructions
Write-Host "`n[$step] GitHub Secrets Setup" -ForegroundColor Yellow
$step++
Write-Host "`n📋 Add these secrets to your GitHub repository:" -ForegroundColor Cyan
Write-Host "   Repository URL: $repoUrl/settings/secrets/actions`n" -ForegroundColor Blue

$secrets = @()
if ($vercelToken) { $secrets += "VERCEL_TOKEN = $vercelToken" }
if ($vercelOrgId) { $secrets += "VERCEL_ORG_ID = $vercelOrgId" }
if ($vercelProjectId) { $secrets += "VERCEL_PROJECT_ID = $vercelProjectId" }
if ($railwayToken) { $secrets += "RAILWAY_TOKEN = $railwayToken" }
if ($railwayServiceId) { $secrets += "RAILWAY_SERVICE_ID = $railwayServiceId" }
if ($reactAppApiUrl) { $secrets += "REACT_APP_API_URL = $reactAppApiUrl" }
if ($blockchainNetworkId) { $secrets += "REACT_APP_BLOCKCHAIN_NETWORK_ID = $blockchainNetworkId" }

Write-Host "Required Secrets:" -ForegroundColor Yellow
foreach ($secret in $secrets) {
    Write-Host "   • $secret" -ForegroundColor White
}

Write-Host "`n📝 Instructions:" -ForegroundColor Cyan
Write-Host "   1. Go to: $repoUrl/settings/secrets/actions" -ForegroundColor White
Write-Host "   2. Click 'New repository secret' for each secret above" -ForegroundColor White
Write-Host "   3. Use the exact name (left side) and paste the value (right side)" -ForegroundColor White
Write-Host "   4. Click 'Add secret' for each one" -ForegroundColor White

# Step 7: Create setup checklist
Write-Host "`n[$step] Creating setup checklist..." -ForegroundColor Yellow
$step++

$checklist = @"
# Automated Deployment Activation Checklist

## ✅ Prerequisites
- [ ] GitHub repository is accessible
- [ ] Vercel account created
- [ ] Railway account created

## 🔑 GitHub Secrets (Required)
- [ ] VERCEL_TOKEN added
- [ ] VERCEL_ORG_ID added
- [ ] VERCEL_PROJECT_ID added
- [ ] RAILWAY_TOKEN added
- [ ] RAILWAY_SERVICE_ID added
- [ ] REACT_APP_API_URL added
- [ ] REACT_APP_BLOCKCHAIN_NETWORK_ID added

## 🧪 Test Deployment
- [ ] Make a small change to frontend code
- [ ] Commit and push: `git push origin main`
- [ ] Check GitHub Actions tab for workflow run
- [ ] Verify deployment in Vercel dashboard
- [ ] Make a small change to backend code
- [ ] Commit and push: `git push origin main`
- [ ] Verify deployment in Railway dashboard

## 📊 Monitoring
- [ ] GitHub Actions workflows are running
- [ ] Vercel deployments are successful
- [ ] Railway deployments are successful

## 🎉 Activation Complete!
Once all secrets are added and test deployments succeed, your automation is active!

"@

$checklist | Out-File -FilePath "DEPLOYMENT_ACTIVATION_CHECKLIST.md" -Encoding UTF8
Write-Host "✅ Checklist created: DEPLOYMENT_ACTIVATION_CHECKLIST.md" -ForegroundColor Green

# Step 8: Verify workflow files exist
Write-Host "`n[$step] Verifying workflow files..." -ForegroundColor Yellow
$step++

$workflows = @(
    ".github/workflows/deploy-frontend.yml",
    ".github/workflows/deploy-backend.yml",
    ".github/workflows/ci.yml"
)

$allExist = $true
foreach ($workflow in $workflows) {
    if (Test-Path $workflow) {
        Write-Host "   ✅ $workflow exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $workflow missing" -ForegroundColor Red
        $allExist = $false
    }
}

if ($allExist) {
    Write-Host "`n✅ All workflow files are in place!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some workflow files are missing. Please ensure all workflows are committed." -ForegroundColor Red
}

# Final Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Add all GitHub secrets (see checklist above)" -ForegroundColor White
Write-Host "   2. Test with a small code change and push" -ForegroundColor White
Write-Host "   3. Monitor GitHub Actions tab for workflow runs" -ForegroundColor White
Write-Host "   4. Check deployment status in Vercel/Railway" -ForegroundColor White
Write-Host ""
Write-Host "📚 Full documentation: AUTOMATED_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "📋 Checklist: DEPLOYMENT_ACTIVATION_CHECKLIST.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Once secrets are added, automation will be active!" -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Cyan

