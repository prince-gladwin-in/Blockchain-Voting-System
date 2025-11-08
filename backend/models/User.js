import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic user information
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Personal information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  // Blockchain-related information
  walletAddress: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address']
  },
  
  // User roles and permissions
  role: {
    type: String,
    enum: ['voter', 'admin', 'super_admin'],
    default: 'voter'
  },
  
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationToken: {
    type: String,
    select: false
  },
  
  // Blockchain verification status
  isBlockchainVerified: {
    type: Boolean,
    default: false
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Voting history (references to elections)
  votingHistory: [{
    electionId: {
      type: String, // Blockchain election ID
      required: true
    },
    transactionHash: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Profile information
  profile: {
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters']
    }
  },
  
  // Security and tracking
  lastLogin: {
    type: Date,
    default: null
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date,
    default: null
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to add voting record
userSchema.methods.addVotingRecord = function(electionId, transactionHash) {
  this.votingHistory.push({
    electionId,
    transactionHash,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Static method to find verified users
userSchema.statics.findVerifiedUsers = function() {
  return this.find({ 
    isVerified: true, 
    isActive: true,
    isBlockchainVerified: true 
  });
};

export default mongoose.model('User', userSchema);
