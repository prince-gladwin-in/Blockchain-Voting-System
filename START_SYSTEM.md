# 🚀 Quick Start Guide - Blockchain Voting System

## One-Time Setup (First Time Only)

### 1. Install All Dependencies

Open PowerShell/Command Prompt in the project root directory and run:

```powershell
# Install root dependencies
npm install

# Install contracts dependencies
cd contracts
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Files

#### Backend Environment (.env)
Create `backend\.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blockchain_voting
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
BLOCKCHAIN_NETWORK_URL=http://127.0.0.1:8545
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment (.env)
Create `frontend\.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BLOCKCHAIN_NETWORK_ID=31337
```

### 3. Ensure MongoDB is Running

**Windows:**
- MongoDB should start automatically as a service
- Check in Services (Win + R → services.msc)
- Look for "MongoDB Server" and ensure it's running

**If not running:**
```powershell
net start MongoDB
```

---

## 🎯 Starting the System (Every Time)

You need to open **4 separate terminal windows**:

### Terminal 1: Hardhat Blockchain Node

```powershell
cd contracts
npx hardhat node
```

**Keep this terminal running!** You'll see test accounts with private keys.

---

### Terminal 2: Deploy Smart Contracts (One Time After Starting Node)

**Wait for Terminal 1 to fully start, then run:**

```powershell
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Output should show:**
```
✅ VotingSystem deployed to: 0x...
📦 Contract artifacts saved to frontend/src/contracts/
```

**You can close this terminal after deployment succeeds.**

---

### Terminal 3: Backend Server

```powershell
cd backend
npm run dev
```

**Wait for:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Keep this terminal running!**

---

### Terminal 4: Frontend Application

```powershell
cd frontend
npm start
```

**Browser will automatically open at:** `http://localhost:3000`

**Keep this terminal running!**

---

## 🦊 MetaMask Setup (One Time Only)

### 1. Add Local Network to MetaMask

1. Open MetaMask extension
2. Click network dropdown (top)
3. Click "Add Network" → "Add a network manually"
4. Fill in:
   - **Network Name:** Localhost 8545
   - **New RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
5. Click "Save"

### 2. Import Test Account

1. From Terminal 1 (Hardhat node), copy **Account #0 Private Key**
2. In MetaMask: Click account icon → "Import Account"
3. Paste the private key
4. Click "Import"

**You now have test ETH to interact with the blockchain!**

---

## 👤 Create Admin Account

### 1. Register Admin User

1. Go to `http://localhost:3000/register`
2. Fill in:
   - Username: `admin`
   - Email: `admin@votingsystem.com`
   - Password: `Admin@123` (or your choice)
   - First Name: `Admin`
   - Last Name: `User`
3. Click "Register"

### 2. Promote to Admin Role

Open a new terminal and run:

```powershell
mongosh
```

Then in MongoDB shell:

```javascript
use blockchain_voting

db.users.updateOne(
  { email: "admin@votingsystem.com" },
  { $set: { role: "admin", isVerified: true, isBlockchainVerified: true } }
)

exit
```

### 3. Log In as Admin

1. Go to `http://localhost:3000/login`
2. Use admin credentials
3. You should now see "Admin" in the navigation bar

---

## 🗳️ Create Your First Election

### As Admin:

1. Click **"Admin"** in navigation
2. Click **"Create New Election"**
3. Fill in election details:
   ```
   Title: Test Election 2024
   Description: A test election for demonstration
   Election Type: Parliamentary
   Start Time: [Current time + 5 minutes]
   End Time: [Current time + 1 hour]
   ```

4. **Add Candidates** (minimum 2):
   - Click "Add Candidate"
   - Candidate 1:
     - Name: John Smith
     - Party: Democratic Party
     - Description: Experienced leader
   - Candidate 2:
     - Name: Jane Doe
     - Party: Republican Party
     - Description: Fresh perspective

5. Click **"Create Election"**
6. **Confirm in MetaMask** (this deploys to blockchain)
7. Wait for confirmation

---

## 👥 Create Voter Accounts

### Register Regular Users:

1. Open incognito/private browser window
2. Go to `http://localhost:3000/register`
3. Create user account (different from admin)
4. Log in with new account

### Verify User (As Admin):

1. In main browser, go to `http://localhost:3000/admin/users`
2. Find the new user
3. Click the green checkmark to verify

---

## 🎯 Vote in Election

### As Regular User:

1. Click **"Elections"** in navigation
2. Click on your test election
3. Click **"Vote Now"**
4. **Fill in Voter Details** (all required):
   - Full Name
   - Email
   - Phone Number (10 digits)
   - Voter ID
   - Address

5. Click **"Submit Details & Proceed to Vote"**
6. **Select ONE Candidate** (click on card)
7. Review your selection
8. Click **"Cast Your Vote"**
9. **Connect MetaMask** if not already connected
10. **Confirm transaction** in MetaMask
11. Wait for blockchain confirmation
12. You'll be redirected to results!

---

## 📊 View Results and Dashboard

### Admin Dashboard:
- `http://localhost:3000/admin`
- See all users, elections, and statistics
- View voter records for each election

### User Dashboard:
- `http://localhost:3000/dashboard`
- See your voting history

### Election Results:
- `http://localhost:3000/results/:electionId`
- Real-time vote counts
- Updated from blockchain

---

## 🔄 System Status Checklist

Before using the system, ensure all are running:

- [ ] **MongoDB** - Running as service
- [ ] **Terminal 1** - Hardhat node running
- [ ] **Terminal 2** - Contracts deployed (can close after)
- [ ] **Terminal 3** - Backend server running
- [ ] **Terminal 4** - Frontend running
- [ ] **MetaMask** - Configured with local network
- [ ] **MetaMask** - Test account imported
- [ ] **Admin Account** - Created and promoted
- [ ] **Browser** - Open at http://localhost:3000

---

## 🛑 Stopping the System

To stop all services:

1. **Terminal 4 (Frontend):** Press `Ctrl + C`
2. **Terminal 3 (Backend):** Press `Ctrl + C`
3. **Terminal 1 (Hardhat):** Press `Ctrl + C`

MongoDB can keep running as a service.

---

## 🔄 Restarting the System

**Next time you want to use the system:**

1. Ensure MongoDB is running
2. Start Terminal 1 (Hardhat node)
3. Deploy contracts again (Terminal 2)
4. Start Terminal 3 (Backend)
5. Start Terminal 4 (Frontend)

**Note:** You'll need to redeploy contracts each time you restart Hardhat node, as the local blockchain resets.

---

## 🐛 Common Issues

### "Cannot connect to MongoDB"
```powershell
# Start MongoDB service
net start MongoDB
```

### "Port 3000 already in use"
```powershell
# Kill the process using port 3000
npx kill-port 3000
```

### "Port 5000 already in use"
```powershell
# Kill the process using port 5000
npx kill-port 5000
```

### "MetaMask transaction failed"
- Reset MetaMask: Settings → Advanced → Reset Account
- Ensure you're on "Localhost 8545" network
- Check you have test ETH

### "Smart contract not found"
- Redeploy contracts (Terminal 2 steps)
- Check `frontend/src/contracts/` has files

---

## 📱 Quick Access URLs

### Public Pages:
- Home: http://localhost:3000/
- Elections: http://localhost:3000/elections
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register

### Admin Pages:
- Admin Dashboard: http://localhost:3000/admin
- Manage Users: http://localhost:3000/admin/users
- Manage Elections: http://localhost:3000/admin/elections
- Create Election: http://localhost:3000/admin/elections/create

### User Pages:
- User Dashboard: http://localhost:3000/dashboard
- Profile: http://localhost:3000/profile

### API:
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

---

## ✅ Success Indicators

**System is ready when you see:**

✅ Hardhat node showing "Started HTTP and WebSocket JSON-RPC server"
✅ Backend showing "🚀 Server running on port 5000"
✅ Frontend opens in browser automatically
✅ MetaMask shows test ETH balance
✅ Can log in as admin
✅ Admin dashboard loads with statistics

---

## 🎉 You're Ready!

The system is now fully operational. You can:
- Create elections as admin
- Register voters
- Cast votes with blockchain verification
- View real-time results
- Manage users and elections

**Happy Voting! 🗳️**
