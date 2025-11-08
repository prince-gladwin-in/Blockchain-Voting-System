import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: String, // Blockchain candidate ID
    required: true
  },
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
    maxlength: [100, 'Candidate name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Candidate description is required'],
    trim: true,
    maxlength: [1000, 'Candidate description cannot exceed 1000 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  party: {
    type: String,
    trim: true,
    maxlength: [100, 'Party name cannot exceed 100 characters']
  },
  manifesto: {
    type: String,
    maxlength: [5000, 'Manifesto cannot exceed 5000 characters']
  },
  socialLinks: {
    website: String,
    twitter: String,
    facebook: String,
    linkedin: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const electionSchema = new mongoose.Schema({
  // Blockchain reference
  blockchainElectionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Presidential', 'Parliamentary', 'Local', 'Referendum', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Upcoming', 'Ended'],
    default: 'Upcoming'
  },
  region: {
    type: String,
    required: true,
    default: 'India'
  },
  parties: [{
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String
    },
    description: String
  }],
  updates: [{
    title: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    content: String
  }],
  
  // Basic election information
  title: {
    type: String,
    required: [true, 'Election title is required'],
    trim: true,
    maxlength: [200, 'Election title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Election description is required'],
    trim: true,
    maxlength: [2000, 'Election description cannot exceed 2000 characters']
  },
  
  // Election timing
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  
  // Election status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'ended', 'cancelled'],
    default: 'draft'
  },
  
  // Election type and settings
  electionType: {
    type: String,
    enum: ['presidential', 'parliamentary', 'local', 'referendum', 'other'],
    required: [true, 'Election type is required']
  },
  
  // Voting settings
  votingSettings: {
    allowMultipleVotes: {
      type: Boolean,
      default: false
    },
    maxVotesPerVoter: {
      type: Number,
      default: 1,
      min: 1
    },
    requireVerification: {
      type: Boolean,
      default: true
    },
    anonymousVoting: {
      type: Boolean,
      default: true
    }
  },
  
  // Candidates
  candidates: [candidateSchema],
  
  // Election administration
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  administrators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'observer'],
      default: 'admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Blockchain transaction details
  deploymentTransaction: {
    hash: String,
    blockNumber: Number,
    gasUsed: Number
  },
  
  // Statistics (cached from blockchain)
  statistics: {
    totalVotes: {
      type: Number,
      default: 0
    },
    totalEligibleVoters: {
      type: Number,
      default: 0
    },
    turnoutPercentage: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Results (cached from blockchain)
  results: [{
    candidateId: String,
    voteCount: Number,
    percentage: Number
  }],
  
  // Media and documents
  media: {
    banner: String,
    logo: String,
    documents: [{
      name: String,
      url: String,
      type: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Election rules and regulations
  rules: {
    eligibilityCriteria: String,
    votingProcedure: String,
    disputeResolution: String
  },
  
  // Visibility and access
  isPublic: {
    type: Boolean,
    default: true
  },
  
  accessControl: {
    allowedVoters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    restrictedRegions: [String],
    requiresInvitation: {
      type: Boolean,
      default: false
    }
  },
  
  // Audit trail
  auditLog: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: mongoose.Schema.Types.Mixed
  }],
  
  // Voter records (for admin dashboard visibility)
  voterRecords: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    voterDetails: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      voterId: String
    },
    candidateId: String,
    transactionHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
electionSchema.index({ blockchainElectionId: 1 });
electionSchema.index({ status: 1 });
electionSchema.index({ startTime: 1, endTime: 1 });
electionSchema.index({ electionType: 1 });
electionSchema.index({ createdBy: 1 });
electionSchema.index({ 'candidates.candidateId': 1 });

// Virtual for election duration
electionSchema.virtual('duration').get(function() {
  return this.endTime - this.startTime;
});

// Virtual for time remaining
electionSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  if (now < this.startTime) {
    return this.startTime - now; // Time until start
  } else if (now < this.endTime) {
    return this.endTime - now; // Time until end
  }
  return 0; // Election has ended
});

// Virtual for election phase
electionSchema.virtual('phase').get(function() {
  const now = new Date();
  if (now < this.startTime) {
    return 'upcoming';
  } else if (now >= this.startTime && now <= this.endTime) {
    return 'active';
  } else {
    return 'ended';
  }
});

// Pre-save middleware for validation
electionSchema.pre('save', function(next) {
  // Validate that end time is after start time
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
    return;
  }
  
  // Validate that start time is in the future for new elections
  if (this.isNew && this.startTime <= new Date()) {
    next(new Error('Start time must be in the future'));
    return;
  }
  
  next();
});

// Method to add candidate
electionSchema.methods.addCandidate = function(candidateData) {
  this.candidates.push(candidateData);
  this.auditLog.push({
    action: 'candidate_added',
    performedBy: candidateData.addedBy || this.createdBy,
    details: { candidateId: candidateData.candidateId, name: candidateData.name }
  });
  return this.save();
};

// Method to update statistics
electionSchema.methods.updateStatistics = function(stats) {
  this.statistics = {
    ...this.statistics.toObject(),
    ...stats,
    lastUpdated: new Date()
  };
  return this.save();
};

// Method to update results
electionSchema.methods.updateResults = function(results) {
  this.results = results;
  this.statistics.lastUpdated = new Date();
  return this.save();
};

// Method to add audit log entry
electionSchema.methods.addAuditEntry = function(action, performedBy, details = {}) {
  this.auditLog.push({
    action,
    performedBy,
    details,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to find active elections
electionSchema.statics.findActiveElections = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    startTime: { $lte: now },
    endTime: { $gte: now }
  }).populate('createdBy', 'username firstName lastName');
};

// Static method to find upcoming elections
electionSchema.statics.findUpcomingElections = function() {
  const now = new Date();
  return this.find({
    status: { $in: ['scheduled', 'draft'] },
    startTime: { $gt: now }
  }).populate('createdBy', 'username firstName lastName');
};

// Static method to find elections by type
electionSchema.statics.findByType = function(electionType) {
  return this.find({ electionType }).populate('createdBy', 'username firstName lastName');
};

export default mongoose.model('Election', electionSchema);
