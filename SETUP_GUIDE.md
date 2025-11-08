# Blockchain Voting System - Complete Setup Guide

This guide will walk you through setting up the complete blockchain voting system on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **MetaMask** browser extension - [Install here](https://metamask.io/)

## 🏗️ Project Structure

```
blockchain-voting-system/
├── contracts/          # Solidity smart contracts & Hardhat setup
├── backend/            # Node.js/Express API server
├── frontend/           # React.js web application
├── docs/              # Documentation
└── scripts/           # Deployment and utility scripts
```

## 🚀 Installation Steps

### 1. Install Root Dependencies

```bash
# Navigate to project root
cd "c:\Users\princ\OneDrive\Desktop\Blockchain Voting System"

# Install root dependencies
npm install
```

### 2. Set Up Smart Contracts

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Run tests to verify everything works
npm test

# Start local blockchain (keep this running in a separate terminal)
npm run node
```

### 3. Deploy Smart Contracts

In a new terminal:

```bash
cd contracts

# Deploy contracts to local network
npm run deploy
```

**Important**: After deployment, note the contract address displayed in the console.

### 4. Set Up Backend Server

```bash
# Navigate to backend directory
cd ../backend

# Install dependencies
npm install

# Copy environment variables
copy .env.example .env

# Edit .env file with your configuration
notepad .env
```

**Configure your `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blockchain_voting

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Blockchain Configuration
BLOCKCHAIN_NETWORK_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=your_deployed_contract_address_from_step_3
PRIVATE_KEY=your_private_key_from_hardhat_accounts

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Start the backend server:**

```bash
npm run dev
```

### 5. Set Up Frontend Application

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at `http://localhost:3000`

## 🔧 MongoDB Setup

### Option 1: Local MongoDB Installation

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env` file

## 🦊 MetaMask Configuration

### 1. Install MetaMask
- Install the MetaMask browser extension
- Create a new wallet or import existing one

### 2. Add Local Network
- Open MetaMask
- Click network dropdown (usually shows "Ethereum Mainnet")
- Click "Add Network"
- Enter the following details:
  - **Network Name**: Hardhat Local
  - **New RPC URL**: http://127.0.0.1:8545
  - **Chain ID**: 31337
  - **Currency Symbol**: ETH

### 3. Import Test Account
- In MetaMask, click account icon → Import Account
- Copy private key from Hardhat console (when you ran `npm run node`)
- Import the account

## 🧪 Testing the System

### 1. Backend API Tests

```bash
cd backend
npm test
```

### 2. Smart Contract Tests

```bash
cd contracts
npm test
```

### 3. Manual Testing

1. **Register a new user**:
   - Go to `http://localhost:3000/register`
   - Create account with valid email

2. **Connect wallet**:
   - Login to your account
   - Connect MetaMask wallet
   - Approve the connection

3. **Create an election (Admin)**:
   - You'll need admin privileges
   - Go to admin dashboard
   - Create a test election

4. **Vote in election**:
   - Browse elections
   - Vote in active election
   - Confirm transaction in MetaMask

## 🔐 Security Configuration

### 1. Environment Variables

**Never commit sensitive data to version control:**

```bash
# Add to .gitignore
.env
*.log
node_modules/
```

### 2. JWT Secret

Generate a secure JWT secret:

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Security

- Use strong MongoDB credentials
- Enable authentication
- Use connection string with credentials

## 🚀 Production Deployment

### 1. Smart Contracts

Deploy to mainnet or testnet:

```bash
cd contracts

# Deploy to testnet (e.g., Goerli)
npx hardhat run scripts/deploy.js --network goerli
```

### 2. Backend Deployment

Popular options:
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2**: Full control, requires setup
- **DigitalOcean**: Balanced option
- **Railway**: Modern alternative to Heroku

### 3. Frontend Deployment

Popular options:
- **Vercel**: Automatic deployments from Git
- **Netlify**: Great for React apps
- **AWS S3 + CloudFront**: Scalable option

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me          # Get current user
POST /api/auth/connect-wallet # Connect wallet
```

### Election Endpoints

```
GET    /api/elections           # Get all elections
GET    /api/elections/:id       # Get election details
POST   /api/elections           # Create election (admin)
PUT    /api/elections/:id       # Update election (admin)
GET    /api/elections/:id/results # Get election results
```

### User Endpoints

```
GET  /api/users/profile        # Get user profile
PUT  /api/users/profile        # Update profile
GET  /api/users/voting-history # Get voting history
```

### Blockchain Endpoints

```
GET  /api/blockchain/status           # Blockchain connection status
POST /api/blockchain/register-voter   # Register voter on blockchain
GET  /api/blockchain/voter/:address   # Get voter info
POST /api/blockchain/vote             # Record vote transaction
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to MongoDB"**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **"MetaMask not detected"**
   - Install MetaMask extension
   - Refresh the page
   - Check browser compatibility

3. **"Contract not deployed"**
   - Run `npm run node` in contracts directory
   - Deploy contracts with `npm run deploy`
   - Update contract address in backend `.env`

4. **"Transaction failed"**
   - Check MetaMask network (should be Hardhat Local)
   - Ensure sufficient ETH balance
   - Check gas settings

5. **"CORS errors"**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if backend server is running
   - Ensure ports match (frontend: 3000, backend: 5000)

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# Frontend
REACT_APP_DEBUG=true npm start
```

## 📊 System Architecture

### Technology Stack

- **Blockchain**: Ethereum, Solidity, Hardhat
- **Backend**: Node.js, Express.js, MongoDB, Web3.js
- **Frontend**: React.js, Tailwind CSS, Web3 integration
- **Authentication**: JWT tokens, bcrypt
- **Security**: Helmet, CORS, rate limiting

### Data Flow

1. **User Registration**: User → Backend → Database
2. **Wallet Connection**: User → MetaMask → Backend → Blockchain
3. **Election Creation**: Admin → Backend → Database → Blockchain
4. **Voting Process**: User → Frontend → MetaMask → Blockchain → Backend
5. **Results Display**: Blockchain → Backend → Frontend → User

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter issues:

1. Check this guide first
2. Search existing issues on GitHub
3. Create new issue with:
   - System information
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

## 🎯 Next Steps

After basic setup:

1. **Implement remaining features**:
   - Complete voting interface
   - Results visualization
   - Admin panels
   - Profile management

2. **Enhance security**:
   - Add input validation
   - Implement rate limiting
   - Add audit logging

3. **Improve UX**:
   - Add loading states
   - Error handling
   - Mobile responsiveness

4. **Deploy to production**:
   - Choose hosting providers
   - Set up CI/CD
   - Configure monitoring

---

**Happy Voting! 🗳️**

For more information, visit our documentation or contact the development team.
