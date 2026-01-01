# 🗳️ Blockchain Voting System

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)

![GitHub Stars](https://img.shields.io/github/stars/Gabimaru123/Blockchain-Voting-System?style=for-the-badge)
![GitHub Forks](https://img.shields.io/github/forks/Gabimaru123/Blockchain-Voting-System?style=for-the-badge)
![GitHub Issues](https://img.shields.io/github/issues/Gabimaru123/Blockchain-Voting-System?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

</div>

---

A **secure, transparent, and decentralized** voting system built with blockchain technology, featuring separate admin and user interfaces with comprehensive voter management.

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📖 Detailed Documentation](#-detailed-documentation)
- [👤 User Roles & Features](#-user-roles--features)
- [🔒 Security Features](#-security-features)
- [📁 Project Structure](#-project-structure)
- [🎯 Usage Workflow](#-usage-workflow)
- [🧪 Testing](#-testing)
- [🐛 Troubleshooting](#-troubleshooting)
- [📊 Technology Stack](#-technology-stack)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Key Features

### 🔐 Security & Transparency
- **One Vote Per User**: Blockchain-enforced restriction preventing duplicate voting
- **Immutable Records**: All votes permanently stored on blockchain
- **Transparent Process**: Publicly verifiable election results
- **Secure Authentication**: JWT-based user authentication with role management

### 👥 User Management
- **Mandatory Voter Details**: Complete voter information collection (name, email, phone, address, voter ID)
- **Admin Dashboard**: Comprehensive user oversight and management
- **Role-Based Access**: Separate interfaces for admins and voters
- **User Verification**: Admin approval system for voter eligibility

### 🗳️ Voting Features
- **Single Candidate Selection**: Mandatory selection of exactly ONE candidate
- **Real-time Results**: Live vote counting from blockchain
- **Multiple Elections**: Support for concurrent elections
- **Election Management**: Full lifecycle management (create, start, end)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Admin Dashboard │         │  Voter Interface │         │
│  │  - User Mgmt     │         │  - Fill Details  │         │
│  │  - Elections     │         │  - Select Party  │         │
│  │  - Analytics     │         │  - Cast Vote     │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   REACT FRONTEND (Port 3000)                │
│  - Modern UI with TailwindCSS                               │
│  - Web3 Integration for Blockchain                          │
│  - Real-time Updates                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              NODE.JS BACKEND (Port 5000)                    │
│  - RESTful API                                              │
│  - User Authentication & Authorization                      │
│  - Blockchain Integration                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────┐
        │                                   │
        ↓                                   ↓
┌──────────────────┐            ┌──────────────────┐
│    MONGODB       │            │  ETHEREUM        │
│  - User Data     │            │  BLOCKCHAIN      │
│  - Elections     │            │  - Votes         │
│  - Voter Records │            │  - Smart Contract│
└──────────────────┘            └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** v5.0+ ([Download](https://www.mongodb.com/try/download/community))
- **MetaMask** Browser Extension ([Install](https://metamask.io/))

### Installation

1. **Install all dependencies**:
   ```bash
   # Root dependencies
   npm install
   
   # Smart contracts
   cd contracts && npm install && cd ..
   
   # Backend
   cd backend && npm install && cd ..
   
   # Frontend
   cd frontend && npm install && cd ..
   ```

2. **Configure environment variables**:
   
   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blockchain_voting
   JWT_SECRET=your_secret_key_here
   BLOCKCHAIN_NETWORK_URL=http://127.0.0.1:8545
   FRONTEND_URL=http://localhost:3000
   ```
   
   Create `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_BLOCKCHAIN_NETWORK_ID=31337
   ```

3. **Start MongoDB**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

4. **Start Hardhat blockchain** (Terminal 1):
   ```bash
   cd contracts
   npx hardhat node
   ```

5. **Deploy smart contracts** (Terminal 2):
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

6. **Start backend server** (Terminal 3):
   ```bash
   cd backend
   npm run dev
   ```

7. **Start frontend** (Terminal 4):
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**: http://localhost:3000

## 📖 Detailed Documentation

- **[START_SYSTEM.md](./START_SYSTEM.md)** - Quick start guide with step-by-step instructions
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment and troubleshooting guide

## 👤 User Roles & Features

### 🔧 Admin Features
Access: `http://localhost:3000/admin`

- **Dashboard**: View system statistics and recent activity
- **User Management**: 
  - View all registered users
  - Verify user accounts
  - Manage user roles (voter, admin, super_admin)
  - Activate/deactivate accounts
- **Election Management**:
  - Create new elections
  - Add candidates with party details
  - Deploy elections to blockchain
  - Start/end elections
  - View voter records and detailed analytics

### 🗳️ Voter Features
Access: `http://localhost:3000/vote/:id`

1. **Fill Mandatory Details**:
   - Full Name (required)
   - Email Address (required)
   - Phone Number (required, 10 digits)
   - Voter ID (required)
   - Complete Address (required)

2. **Select Candidate**:
   - View all candidates with party information
   - Select exactly ONE candidate (mandatory)
   - Cannot change selection after submission

3. **Cast Vote**:
   - Review voter details and selection
   - Connect MetaMask wallet
   - Confirm blockchain transaction
   - Receive confirmation and transaction hash

## 🔒 Security Features

### Blockchain Level
- ✅ One vote per wallet address (enforced by smart contract)
- ✅ Immutable vote storage
- ✅ Transparent and auditable
- ✅ Decentralized verification

### Application Level
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Password hashing (bcrypt)
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS protection

### Data Validation
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Required field enforcement
- ✅ Transaction verification
- ✅ Wallet address validation

## 📁 Project Structure

```
blockchain-voting-system/
├── contracts/                  # Smart Contracts
│   ├── contracts/
│   │   └── VotingSystem.sol   # Main voting contract
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   └── hardhat.config.js
│
├── backend/                    # Node.js Backend
│   ├── models/
│   │   ├── User.js            # User model with roles
│   │   └── Election.js        # Election model with voter records
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management routes
│   │   ├── elections.js       # Election routes
│   │   └── blockchain.js      # Blockchain interaction routes
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js
│   └── server.js
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Auth components
│   │   │   ├── layout/        # Layout components
│   │   │   └── common/        # Reusable components
│   │   ├── pages/
│   │   │   ├── admin/         # Admin pages
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminUsers.js
│   │   │   │   └── CreateElection.js
│   │   │   ├── Vote.js        # Voting interface
│   │   │   └── Results.js     # Results page
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── Web3Context.js
│   │   └── App.js
│   └── package.json
│
├── START_SYSTEM.md            # Quick start guide
├── DEPLOYMENT_GUIDE.md        # Detailed deployment guide
└── README.md                  # This file
```

## 🎯 Usage Workflow

### Creating an Election (Admin)

1. Log in as admin
2. Navigate to Admin Dashboard
3. Click "Create New Election"
4. Fill in election details:
   - Title, description, type
   - Start and end times
5. Add candidates (minimum 2):
   - Name, party, description
6. Deploy to blockchain (MetaMask confirmation)
7. Start election when ready

### Voting (User)

1. Register and log in
2. Browse available elections
3. Click "Vote Now" on desired election
4. Fill in all mandatory voter details
5. Select ONE candidate from the list
6. Review details and selection
7. Connect MetaMask wallet
8. Confirm blockchain transaction
9. View confirmation and results

### Managing Users (Admin)

1. Go to Admin → Manage Users
2. View all registered users
3. Actions available:
   - Verify unverified users
   - Change user roles
   - Activate/deactivate accounts
   - View user details and voting history

## 🧪 Testing

```bash
# Test smart contracts
cd contracts
npx hardhat test

# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🔄 Common Commands

```bash
# Start local blockchain
npm run node

# Compile contracts
npm run compile

# Deploy contracts
npm run deploy

# Start backend only
npm run backend

# Start frontend only
npm run frontend

# Start both backend and frontend
npm run dev
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

### MetaMask Transaction Failed
- Reset MetaMask: Settings → Advanced → Reset Account
- Ensure connected to Localhost 8545 network
- Check sufficient test ETH balance

### Contract Not Found
```bash
# Redeploy contracts
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

## 📊 Technology Stack

- **Frontend**: React, TailwindCSS, Web3.js, Axios, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Blockchain**: Solidity, Hardhat, Ethers.js, OpenZeppelin
- **Tools**: MetaMask, Hardhat Network, MongoDB Compass

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for Ethereum development environment
- React and TailwindCSS communities

## 📞 Support

For issues and questions:
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Review [START_SYSTEM.md](./START_SYSTEM.md)
- Open an issue on GitHub

---

**Built with ❤️ for transparent and secure democratic processes**
