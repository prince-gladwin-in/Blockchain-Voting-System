import express from 'express';
import { body, validationResult } from 'express-validator';
import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from '../models/User.js';
import Election from '../models/Election.js';
import { requireVerified, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Initialize Web3
let web3;
let votingContract;

try {
  web3 = new Web3(process.env.BLOCKCHAIN_NETWORK_URL || 'http://127.0.0.1:8545');
  
  // Load contract ABI and address
  const contractsPath = path.join(__dirname, '../../frontend/src/contracts');
  
  if (fs.existsSync(path.join(contractsPath, 'contract-address.json'))) {
    const contractAddress = JSON.parse(
      fs.readFileSync(path.join(contractsPath, 'contract-address.json'), 'utf8')
    );
    
    const contractABI = JSON.parse(
      fs.readFileSync(path.join(contractsPath, 'VotingSystem.json'), 'utf8')
    );
    
    votingContract = new web3.eth.Contract(contractABI, contractAddress.VotingSystem);
    console.log('✅ Blockchain connection initialized');
  } else {
    console.log('⚠️ Contract not deployed yet');
  }
} catch (error) {
  console.error('❌ Blockchain connection failed:', error.message);
}

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/blockchain/status
// @desc    Get blockchain connection status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    if (!web3) {
      return res.status(503).json({
        success: false,
        message: 'Blockchain connection not initialized'
      });
    }

    const isConnected = await web3.eth.net.isListening();
    const networkId = await web3.eth.net.getId();
    const blockNumber = await web3.eth.getBlockNumber();

    res.json({
      success: true,
      data: {
        isConnected,
        networkId: networkId.toString(),
        blockNumber: blockNumber.toString(),
        contractDeployed: !!votingContract,
        contractAddress: votingContract?._address || null
      }
    });

  } catch (error) {
    console.error('Blockchain status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blockchain status'
    });
  }
});

// @route   POST /api/blockchain/register-voter
// @desc    Register voter on blockchain
// @access  Private
router.post('/register-voter', requireVerified, [
  body('walletAddress')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum wallet address'),
  body('signature')
    .notEmpty()
    .withMessage('Signature is required')
], handleValidationErrors, async (req, res) => {
  try {
    if (!votingContract) {
      return res.status(503).json({
        success: false,
        message: 'Smart contract not available'
      });
    }

    const { walletAddress, signature } = req.body;
    const user = req.user;

    // Check if user already has a wallet connected
    if (user.walletAddress && user.walletAddress !== walletAddress.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Different wallet already connected to this account'
      });
    }

    // TODO: Verify signature to ensure user owns the wallet
    // This is a critical security step that should be implemented

    // Check if voter is already registered on blockchain
    try {
      const voterInfo = await votingContract.methods.getVoter(walletAddress).call();
      
      if (voterInfo.isRegistered) {
        // Update user's blockchain verification status
        user.walletAddress = walletAddress.toLowerCase();
        user.isBlockchainVerified = true;
        await user.save();

        return res.json({
          success: true,
          message: 'Voter already registered on blockchain',
          data: {
            isRegistered: true,
            isVerified: voterInfo.isVerified
          }
        });
      }
    } catch (error) {
      console.log('Voter not found on blockchain, will register');
    }

    // Register voter on blockchain
    // Note: In a real implementation, this would require the user to sign the transaction
    // For demo purposes, we'll simulate the registration
    const fullName = `${user.firstName} ${user.lastName}`;
    
    // This would be called from the frontend with user's wallet
    const registrationData = {
      voterAddress: walletAddress,
      name: fullName,
      requiresTransaction: true
    };

    // Update user's wallet address
    user.walletAddress = walletAddress.toLowerCase();
    await user.save();

    res.json({
      success: true,
      message: 'Ready to register on blockchain',
      data: registrationData
    });

  } catch (error) {
    console.error('Register voter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register voter'
    });
  }
});

// @route   GET /api/blockchain/voter/:address
// @desc    Get voter information from blockchain
// @access  Public
router.get('/voter/:address', async (req, res) => {
  try {
    if (!votingContract) {
      return res.status(503).json({
        success: false,
        message: 'Smart contract not available'
      });
    }

    const { address } = req.params;

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address'
      });
    }

    const voterInfo = await votingContract.methods.getVoter(address).call();

    res.json({
      success: true,
      data: {
        isRegistered: voterInfo.isRegistered,
        isVerified: voterInfo.isVerified,
        name: voterInfo.name,
        registrationTime: voterInfo.registrationTime
      }
    });

  } catch (error) {
    console.error('Get voter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voter information'
    });
  }
});

// @route   GET /api/blockchain/elections
// @desc    Get elections from blockchain
// @access  Public
router.get('/elections', async (req, res) => {
  try {
    if (!votingContract) {
      return res.status(503).json({
        success: false,
        message: 'Smart contract not available'
      });
    }

    // Get total number of elections
    const totalElections = await votingContract.methods.getTotalElections().call();
    const activeElectionIds = await votingContract.methods.getActiveElections().call();

    const elections = [];

    // Get details for each election
    for (let i = 1; i <= totalElections; i++) {
      try {
        const election = await votingContract.methods.getElection(i).call();
        const candidates = await votingContract.methods.getElectionCandidates(i).call();

        elections.push({
          id: election.id,
          title: election.title,
          description: election.description,
          startTime: new Date(parseInt(election.startTime) * 1000),
          endTime: new Date(parseInt(election.endTime) * 1000),
          isActive: election.isActive,
          totalVotes: election.totalVotes,
          candidateCount: candidates.length
        });
      } catch (error) {
        console.error(`Error getting election ${i}:`, error);
      }
    }

    res.json({
      success: true,
      data: {
        elections,
        totalElections: totalElections.toString(),
        activeElections: activeElectionIds.length
      }
    });

  } catch (error) {
    console.error('Get blockchain elections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blockchain elections'
    });
  }
});

// @route   GET /api/blockchain/elections/:id
// @desc    Get election details from blockchain
// @access  Public
router.get('/elections/:id', async (req, res) => {
  try {
    if (!votingContract) {
      return res.status(503).json({
        success: false,
        message: 'Smart contract not available'
      });
    }

    const electionId = req.params.id;

    // Get election details
    const election = await votingContract.methods.getElection(electionId).call();
    const candidateIds = await votingContract.methods.getElectionCandidates(electionId).call();

    // Get candidate details
    const candidates = [];
    for (const candidateId of candidateIds) {
      const candidate = await votingContract.methods.getCandidate(electionId, candidateId).call();
      candidates.push({
        id: candidate.id,
        name: candidate.name,
        description: candidate.description,
        voteCount: candidate.voteCount
      });
    }

    res.json({
      success: true,
      data: {
        election: {
          id: election.id,
          title: election.title,
          description: election.description,
          startTime: new Date(parseInt(election.startTime) * 1000),
          endTime: new Date(parseInt(election.endTime) * 1000),
          isActive: election.isActive,
          totalVotes: election.totalVotes
        },
        candidates
      }
    });

  } catch (error) {
    console.error('Get blockchain election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blockchain election'
    });
  }
});

// @route   POST /api/blockchain/vote
// @desc    Record vote transaction
// @access  Private
router.post('/vote', requireVerified, [
  body('electionId')
    .notEmpty()
    .withMessage('Election ID is required'),
  body('candidateId')
    .notEmpty()
    .withMessage('Candidate ID is required'),
  body('transactionHash')
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage('Invalid transaction hash'),
  body('voterDetails')
    .isObject()
    .withMessage('Voter details are required')
], handleValidationErrors, async (req, res) => {
  try {
    const { electionId, candidateId, transactionHash, voterDetails } = req.body;
    const user = req.user;

    if (!user.isBlockchainVerified) {
      return res.status(403).json({
        success: false,
        message: 'Blockchain verification required'
      });
    }

    // Validate voter details
    if (!voterDetails.fullName || !voterDetails.email || !voterDetails.phone || 
        !voterDetails.address || !voterDetails.voterId) {
      return res.status(400).json({
        success: false,
        message: 'All voter details are required'
      });
    }

    // Verify transaction on blockchain
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);
    
    if (!receipt) {
      return res.status(400).json({
        success: false,
        message: 'Transaction not found or not confirmed'
      });
    }

    if (!receipt.status) {
      return res.status(400).json({
        success: false,
        message: 'Transaction failed'
      });
    }

    // Check if transaction is a vote transaction to our contract
    if (receipt.to.toLowerCase() !== votingContract._address.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Transaction is not for the voting contract'
      });
    }

    // Add voting record to user with voter details
    await user.addVotingRecord(electionId, transactionHash);

    // Update election statistics in database
    const election = await Election.findById(electionId);
    if (election) {
      // Store voter details (encrypted in production)
      if (!election.voterRecords) {
        election.voterRecords = [];
      }
      
      election.voterRecords.push({
        userId: user._id,
        voterDetails: {
          fullName: voterDetails.fullName,
          email: voterDetails.email,
          phone: voterDetails.phone,
          address: voterDetails.address,
          voterId: voterDetails.voterId
        },
        candidateId: candidateId,
        transactionHash: transactionHash,
        timestamp: new Date()
      });

      election.statistics.totalVotes += 1;
      election.statistics.lastUpdated = new Date();
      await election.save();
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        voterDetails: {
          fullName: voterDetails.fullName,
          voterId: voterDetails.voterId
        }
      }
    });

  } catch (error) {
    console.error('Record vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
});

// @route   POST /api/blockchain/sync-election
// @desc    Sync election data from blockchain
// @access  Private/Admin
router.post('/sync-election/:id', requireAdmin, async (req, res) => {
  try {
    if (!votingContract) {
      return res.status(503).json({
        success: false,
        message: 'Smart contract not available'
      });
    }

    const electionId = req.params.id;
    
    // Find election in database
    const election = await Election.findOne({ blockchainElectionId: electionId });
    
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found in database'
      });
    }

    // Get election data from blockchain
    const blockchainElection = await votingContract.methods.getElection(electionId).call();
    const candidateIds = await votingContract.methods.getElectionCandidates(electionId).call();

    // Get candidate vote counts
    const results = [];
    for (const candidateId of candidateIds) {
      const candidate = await votingContract.methods.getCandidate(electionId, candidateId).call();
      results.push({
        candidateId: candidate.id,
        voteCount: parseInt(candidate.voteCount),
        percentage: blockchainElection.totalVotes > 0 
          ? (parseInt(candidate.voteCount) / parseInt(blockchainElection.totalVotes)) * 100 
          : 0
      });
    }

    // Update election statistics and results
    await election.updateStatistics({
      totalVotes: parseInt(blockchainElection.totalVotes),
      turnoutPercentage: 0 // This would need eligible voter count
    });

    await election.updateResults(results);

    res.json({
      success: true,
      message: 'Election data synchronized successfully',
      data: {
        statistics: election.statistics,
        results: election.results
      }
    });

  } catch (error) {
    console.error('Sync election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync election data'
    });
  }
});

// @route   GET /api/blockchain/transaction/:hash
// @desc    Get transaction details
// @access  Public
router.get('/transaction/:hash', async (req, res) => {
  try {
    if (!web3) {
      return res.status(503).json({
        success: false,
        message: 'Blockchain connection not available'
      });
    }

    const { hash } = req.params;

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction hash'
      });
    }

    const [transaction, receipt] = await Promise.all([
      web3.eth.getTransaction(hash),
      web3.eth.getTransactionReceipt(hash)
    ]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: {
        transaction: {
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          gasPrice: transaction.gasPrice,
          gas: transaction.gas,
          blockNumber: transaction.blockNumber,
          blockHash: transaction.blockHash
        },
        receipt: receipt ? {
          status: receipt.status,
          gasUsed: receipt.gasUsed,
          blockNumber: receipt.blockNumber,
          confirmations: receipt.blockNumber ? 
            (await web3.eth.getBlockNumber()) - receipt.blockNumber : 0
        } : null
      }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction details'
    });
  }
});

export default router;
