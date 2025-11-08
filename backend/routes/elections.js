import express from 'express';
import { body, validationResult } from 'express-validator';
import Election from '../models/Election.js';
import { requireAdmin, requireVerified, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

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

// @route   GET /api/elections
// @desc    Get all elections
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, electionType, search } = req.query;

    // Build filter object
    const filter = { isPublic: true };
    if (status) filter.status = status;
    if (electionType) filter.electionType = electionType;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const elections = await Election.find(filter)
      .populate('createdBy', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Election.countDocuments(filter);

    // Add computed fields
    const electionsWithPhase = elections.map(election => ({
      ...election.toObject(),
      phase: election.phase,
      timeRemaining: election.timeRemaining
    }));

    res.json({
      success: true,
      data: {
        elections: electionsWithPhase,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get elections'
    });
  }
});

// @route   GET /api/elections/active
// @desc    Get active elections
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const elections = await Election.findActiveElections();

    const electionsWithPhase = elections.map(election => ({
      ...election.toObject(),
      phase: election.phase,
      timeRemaining: election.timeRemaining
    }));

    res.json({
      success: true,
      data: {
        elections: electionsWithPhase
      }
    });

  } catch (error) {
    console.error('Get active elections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active elections'
    });
  }
});

// @route   GET /api/elections/upcoming
// @desc    Get upcoming elections
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const elections = await Election.findUpcomingElections();

    const electionsWithPhase = elections.map(election => ({
      ...election.toObject(),
      phase: election.phase,
      timeRemaining: election.timeRemaining
    }));

    res.json({
      success: true,
      data: {
        elections: electionsWithPhase
      }
    });

  } catch (error) {
    console.error('Get upcoming elections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upcoming elections'
    });
  }
});

// @route   GET /api/elections/:id
// @desc    Get election by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('createdBy', 'username firstName lastName')
      .populate('administrators.user', 'username firstName lastName');

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Check if user has access to this election
    if (!election.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this election'
      });
    }

    const electionWithPhase = {
      ...election.toObject(),
      phase: election.phase,
      timeRemaining: election.timeRemaining
    };

    res.json({
      success: true,
      data: {
        election: electionWithPhase
      }
    });

  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get election'
    });
  }
});

// @route   POST /api/elections
// @desc    Create new election
// @access  Private/Admin
router.post('/', requireAdmin, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description is required and cannot exceed 2000 characters'),
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid date'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid date'),
  body('electionType')
    .isIn(['presidential', 'parliamentary', 'local', 'referendum', 'other'])
    .withMessage('Invalid election type')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      electionType,
      votingSettings,
      isPublic,
      rules
    } = req.body;

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be in the future'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Create election (without blockchain ID for now)
    const election = new Election({
      blockchainElectionId: 'pending', // Will be updated after blockchain deployment
      title,
      description,
      startTime: start,
      endTime: end,
      electionType,
      votingSettings: votingSettings || {},
      isPublic: isPublic !== false,
      rules: rules || {},
      createdBy: req.user._id,
      administrators: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    await election.save();

    // Add audit log entry
    await election.addAuditEntry('election_created', req.user._id, {
      title,
      electionType
    });

    const populatedElection = await Election.findById(election._id)
      .populate('createdBy', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      data: {
        election: {
          ...populatedElection.toObject(),
          phase: populatedElection.phase,
          timeRemaining: populatedElection.timeRemaining
        }
      }
    });

  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create election'
    });
  }
});

// @route   PUT /api/elections/:id
// @desc    Update election
// @access  Private/Admin
router.put('/:id', requireAdmin, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Check if user has permission to update this election
    const isCreator = election.createdBy.toString() === req.user._id.toString();
    const isAdmin = election.administrators.some(admin => 
      admin.user.toString() === req.user._id.toString()
    );

    if (!isCreator && !isAdmin && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this election'
      });
    }

    // Prevent updates to active elections
    if (election.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update active election'
      });
    }

    const {
      title,
      description,
      startTime,
      endTime,
      votingSettings,
      isPublic,
      rules
    } = req.body;

    // Update fields
    if (title !== undefined) election.title = title;
    if (description !== undefined) election.description = description;
    if (startTime !== undefined) election.startTime = new Date(startTime);
    if (endTime !== undefined) election.endTime = new Date(endTime);
    if (votingSettings !== undefined) election.votingSettings = { ...election.votingSettings, ...votingSettings };
    if (isPublic !== undefined) election.isPublic = isPublic;
    if (rules !== undefined) election.rules = { ...election.rules, ...rules };

    await election.save();

    // Add audit log entry
    await election.addAuditEntry('election_updated', req.user._id, {
      updatedFields: Object.keys(req.body)
    });

    const populatedElection = await Election.findById(election._id)
      .populate('createdBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Election updated successfully',
      data: {
        election: {
          ...populatedElection.toObject(),
          phase: populatedElection.phase,
          timeRemaining: populatedElection.timeRemaining
        }
      }
    });

  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update election'
    });
  }
});

// @route   POST /api/elections/:id/candidates
// @desc    Add candidate to election
// @access  Private/Admin
router.post('/:id/candidates', requireAdmin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Candidate name is required and cannot exceed 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Candidate description is required and cannot exceed 1000 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Check permissions
    const isCreator = election.createdBy.toString() === req.user._id.toString();
    const isAdmin = election.administrators.some(admin => 
      admin.user.toString() === req.user._id.toString()
    );

    if (!isCreator && !isAdmin && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add candidates to this election'
      });
    }

    // Prevent adding candidates to active elections
    if (election.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add candidates to active election'
      });
    }

    const { name, description, party, manifesto, socialLinks, avatar } = req.body;

    const candidateData = {
      candidateId: `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      party,
      manifesto,
      socialLinks,
      avatar,
      addedBy: req.user._id
    };

    await election.addCandidate(candidateData);

    res.status(201).json({
      success: true,
      message: 'Candidate added successfully',
      data: {
        candidate: candidateData
      }
    });

  } catch (error) {
    console.error('Add candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add candidate'
    });
  }
});

// @route   GET /api/elections/:id/results
// @desc    Get election results
// @access  Public
router.get('/:id/results', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Only show results for ended elections or if user is admin
    const canViewResults = election.status === 'ended' || 
                          (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin'));

    if (!canViewResults) {
      return res.status(403).json({
        success: false,
        message: 'Results not available yet'
      });
    }

    res.json({
      success: true,
      data: {
        results: election.results,
        statistics: election.statistics,
        candidates: election.candidates
      }
    });

  } catch (error) {
    console.error('Get election results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get election results'
    });
  }
});

// @route   PUT /api/elections/:id/blockchain-id
// @desc    Update blockchain election ID
// @access  Private/Admin
router.put('/:id/blockchain-id', requireAdmin, [
  body('blockchainElectionId')
    .notEmpty()
    .withMessage('Blockchain election ID is required'),
  body('deploymentTransaction')
    .optional()
    .isObject()
    .withMessage('Deployment transaction must be an object')
], handleValidationErrors, async (req, res) => {
  try {
    const { blockchainElectionId, deploymentTransaction } = req.body;

    const election = await Election.findByIdAndUpdate(
      req.params.id,
      {
        blockchainElectionId,
        deploymentTransaction,
        status: 'scheduled'
      },
      { new: true }
    ).populate('createdBy', 'username firstName lastName');

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Add audit log entry
    await election.addAuditEntry('blockchain_deployed', req.user._id, {
      blockchainElectionId,
      transactionHash: deploymentTransaction?.hash
    });

    res.json({
      success: true,
      message: 'Blockchain election ID updated successfully',
      data: {
        election: {
          ...election.toObject(),
          phase: election.phase,
          timeRemaining: election.timeRemaining
        }
      }
    });

  } catch (error) {
    console.error('Update blockchain ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blockchain election ID'
    });
  }
});

export default router;
