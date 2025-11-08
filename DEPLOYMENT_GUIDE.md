# Blockchain Voting System - Complete Deployment Guide

## 🚀 Quick Start Guide

This guide will help you set up and run the complete blockchain voting system with admin and user sections.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Installation Steps

### Step 1: Install Dependencies

Open three separate terminal windows for contracts, backend, and frontend.

#### Terminal 1 - Smart Contracts
```bash
cd contracts
npm install
```

#### Terminal 2 - Backend
```bash
cd backend
npm install
```

#### Terminal 3 - Frontend
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/blockchain_voting

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Blockchain Configuration
BLOCKCHAIN_NETWORK_URL=http://127.0.0.1:8545

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Configuration
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BLOCKCHAIN_NETWORK_ID=31337
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or run manually:
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# Or
brew services start mongodb-community
```

### Step 4: Deploy Smart Contracts

In the contracts terminal:

```bash
# Start local Hardhat blockchain
npx hardhat node
```

Keep this terminal running. Open a new terminal for deployment:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

This will:
- Deploy the VotingSystem smart contract
- Save the contract address and ABI to `frontend/src/contracts/`
- Display the deployed contract address

### Step 5: Start Backend Server

In the backend terminal:

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 6: Start Frontend Application

In the frontend terminal:

```bash
npm start
```

The frontend will open automatically at `http://localhost:3000`

## 👤 Creating Admin and User Accounts

### Create Admin Account

1. Go to `http://localhost:3000/register`
2. Fill in the registration form:
   - Username: `admin`
   - Email: `admin@votingsystem.com`
   - Password: `Admin@123`
   - First Name: `Admin`
   - Last Name: `User`
3. Click "Register"

### Promote User to Admin

After registration, you need to manually update the user role in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use the database
use blockchain_voting

# Update user role to admin
db.users.updateOne(
  { email: "admin@votingsystem.com" },
  { $set: { role: "admin", isVerified: true } }
)
```

### Create Regular User Account

1. Go to `http://localhost:3000/register`
2. Fill in the registration form with different details
3. Click "Register"

## 🔗 Connect MetaMask Wallet

### Configure MetaMask for Local Network

1. Open MetaMask extension
2. Click on the network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter the following details:
   - **Network Name:** Localhost 8545
   - **New RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
5. Click "Save"

### Import Test Account

When you started Hardhat node, it displayed several test accounts. Import one:

1. Copy a private key from the Hardhat node terminal
2. In MetaMask, click the account icon → "Import Account"
3. Paste the private key
4. Click "Import"

### Connect Wallet to Application

1. Log in to your account
2. Click "Connect Wallet" button
3. Select the imported account in MetaMask
4. Approve the connection

## 🗳️ Using the System

### Admin Functions

After logging in as admin, you can:

1. **Access Admin Dashboard** - `http://localhost:3000/admin`
   - View user statistics
   - Monitor active elections
   - Quick access to management functions

2. **Manage Users** - `http://localhost:3000/admin/users`
   - View all registered users
   - Verify users
   - Change user roles
   - Activate/deactivate accounts

3. **Create Election** - `http://localhost:3000/admin/elections/create`
   - Set election title and description
   - Define start and end times
   - Add candidates with details
   - Deploy to blockchain

4. **Manage Elections** - `http://localhost:3000/admin/elections`
   - View all elections
   - Edit election details
   - Monitor voting progress
   - View voter records

### User Functions

After logging in as a regular user:

1. **View Elections** - `http://localhost:3000/elections`
   - Browse available elections
   - See election details

2. **Vote in Election** - `http://localhost:3000/vote/:id`
   - Fill in mandatory voter details:
     - Full Name
     - Email Address
     - Phone Number
     - Voter ID
     - Address
   - Select ONE candidate (mandatory)
   - Confirm and submit vote
   - Vote is recorded on blockchain

3. **View Results** - `http://localhost:3000/results/:id`
   - See real-time vote counts
   - View election statistics

## 📊 Creating Your First Election

### Step-by-Step Guide

1. **Log in as Admin**
   - Go to `http://localhost:3000/login`
   - Use admin credentials

2. **Navigate to Create Election**
   - Click "Admin" in navigation
   - Click "Create New Election" or go to `/admin/elections/create`

3. **Fill Election Details**
   ```
   Title: General Election 2024
   Description: National general election for parliamentary seats
   Election Type: Parliamentary
   Start Time: [Select future date/time]
   End Time: [Select date/time after start]
   ```

4. **Add Candidates**
   - Click "Add Candidate"
   - For each candidate, provide:
     - Name: e.g., "John Doe"
     - Party: e.g., "Democratic Party"
     - Description: Brief bio
   - Add at least 2 candidates

5. **Deploy to Blockchain**
   - Review all details
   - Click "Create Election"
   - Confirm MetaMask transaction
   - Wait for blockchain confirmation

6. **Start Election**
   - Once deployed, go to Admin Elections
   - Click "Start Election" when ready
   - Election becomes active for voting

## 🔐 Security Features

### Implemented Security Measures

1. **One Vote Per User**
   - Enforced at blockchain level
   - Cannot vote twice in same election
   - Wallet address verification

2. **Voter Verification**
   - Mandatory user registration
   - Email verification
   - Admin approval required

3. **Data Validation**
   - All voter details validated
   - Email format checking
   - Phone number validation
   - Required field enforcement

4. **Blockchain Immutability**
   - Votes stored on blockchain
   - Cannot be altered or deleted
   - Transparent and auditable

5. **Transaction Verification**
   - Every vote generates blockchain transaction
   - Transaction hash recorded
   - Verifiable on blockchain

## 🧪 Testing the System

### Test Scenario 1: Complete Voting Flow

1. Create admin account and promote to admin role
2. Create 2-3 regular user accounts
3. As admin, create an election with 3 candidates
4. Deploy election to blockchain
5. Start the election
6. As each user:
   - Connect MetaMask wallet
   - Navigate to the election
   - Fill in voter details
   - Select a candidate
   - Submit vote
   - Verify transaction in MetaMask
7. As admin, view voter records and results

### Test Scenario 2: Admin Dashboard

1. Log in as admin
2. View dashboard statistics
3. Check recent users list
4. Check recent elections
5. Navigate to user management
6. Verify a new user
7. Change a user's role

### Test Scenario 3: Voting Restrictions

1. Try to vote without filling details (should fail)
2. Try to vote without selecting candidate (should fail)
3. Try to vote twice in same election (should fail)
4. Try to vote without wallet connected (should fail)

## 📱 Accessing Different Sections

### Public Pages (No Login Required)
- Home: `http://localhost:3000/`
- Elections List: `http://localhost:3000/elections`
- Election Details: `http://localhost:3000/elections/:id`
- Results: `http://localhost:3000/results/:id`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`

### User Pages (Login Required)
- Dashboard: `http://localhost:3000/dashboard`
- Profile: `http://localhost:3000/profile`
- Vote: `http://localhost:3000/vote/:id`

### Admin Pages (Admin Role Required)
- Admin Dashboard: `http://localhost:3000/admin`
- Manage Users: `http://localhost:3000/admin/users`
- Manage Elections: `http://localhost:3000/admin/elections`
- Create Election: `http://localhost:3000/admin/elections/create`

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

#### 2. "Smart contract not deployed"
```bash
# Make sure Hardhat node is running
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

#### 3. "MetaMask transaction failed"
- Ensure you're connected to Localhost 8545 network
- Check if you have enough ETH in test account
- Reset MetaMask account: Settings → Advanced → Reset Account

#### 4. "CORS error in browser"
- Check backend `.env` has correct `FRONTEND_URL`
- Restart backend server after changing `.env`

#### 5. "User not verified"
- Admin must verify users in Admin Dashboard
- Or manually update in MongoDB:
```bash
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isVerified: true } }
)
```

## 🔄 Resetting the System

### Complete Reset

```bash
# 1. Stop all running processes (Ctrl+C in each terminal)

# 2. Clear MongoDB database
mongosh
use blockchain_voting
db.dropDatabase()
exit

# 3. Restart Hardhat node (this resets blockchain)
cd contracts
npx hardhat node

# 4. Redeploy contracts
npx hardhat run scripts/deploy.js --network localhost

# 5. Restart backend
cd backend
npm run dev

# 6. Restart frontend
cd frontend
npm start

# 7. Reset MetaMask
# MetaMask → Settings → Advanced → Reset Account
```

## 📚 Additional Resources

- **Hardhat Documentation:** https://hardhat.org/docs
- **Web3.js Documentation:** https://web3js.readthedocs.io/
- **React Documentation:** https://react.dev/
- **MongoDB Documentation:** https://docs.mongodb.com/
- **MetaMask Documentation:** https://docs.metamask.io/

## 🎯 Next Steps

1. **Production Deployment:**
   - Use a real Ethereum network (Sepolia testnet or mainnet)
   - Set up proper environment variables
   - Configure SSL/TLS certificates
   - Use production MongoDB instance

2. **Enhanced Security:**
   - Implement email verification
   - Add two-factor authentication
   - Encrypt sensitive voter data
   - Implement rate limiting

3. **Additional Features:**
   - Email notifications
   - SMS verification
   - Real-time vote updates
   - Advanced analytics dashboard
   - Export election reports

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code documentation
3. Check browser console for errors
4. Check backend logs for API errors

---

**System Status Checklist:**
- [ ] MongoDB running
- [ ] Hardhat node running
- [ ] Smart contracts deployed
- [ ] Backend server running
- [ ] Frontend application running
- [ ] MetaMask configured
- [ ] Admin account created
- [ ] Test users created
- [ ] Test election created

**You're all set! Happy voting! 🗳️**
