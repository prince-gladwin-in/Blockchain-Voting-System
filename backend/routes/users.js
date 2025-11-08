import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { requireAdmin, requireVerified } from '../middleware/auth.js';

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

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = req.user;

    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
      isBlockchainVerified: user.isBlockchainVerified,
      walletAddress: user.walletAddress,
      profile: user.profile,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      votingHistory: user.votingHistory
    };

    res.json({
      success: true,
      data: {
        user: userProfile
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profile.location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, profile } = req.body;

    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (profile) {
      updateData['profile.bio'] = profile.bio;
      updateData['profile.location'] = profile.location;
      updateData['profile.avatar'] = profile.avatar;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
      isBlockchainVerified: user.isBlockchainVerified,
      walletAddress: user.walletAddress,
      profile: user.profile,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   GET /api/users/voting-history
// @desc    Get user's voting history
// @access  Private
router.get('/voting-history', requireVerified, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        votingHistory: user.votingHistory,
        totalVotes: user.votingHistory.length
      }
    });

  } catch (error) {
    console.error('Get voting history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voting history'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { role, isVerified, isBlockchainVerified, search } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (isBlockchainVerified !== undefined) filter.isBlockchainVerified = isBlockchainVerified === 'true';
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -verificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private/Admin
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify a user (admin only)
// @access  Private/Admin
router.put('/:id/verify', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User verified successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify user'
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put('/:id/role', requireAdmin, [
  body('role')
    .isIn(['voter', 'admin', 'super_admin'])
    .withMessage('Invalid role')
], handleValidationErrors, async (req, res) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;

    // Prevent non-super-admins from creating super-admins
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can assign super admin role'
      });
    }

    // Prevent users from changing their own role
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { role },
      { new: true }
    ).select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (admin only)
// @access  Private/Admin
router.put('/:id/status', requireAdmin, [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const { isActive } = req.body;
    const targetUserId = req.params.id;

    // Prevent users from deactivating themselves
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status'
      });
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { isActive },
      { new: true }
    ).select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics (admin only)
// @access  Private/Admin
router.get('/stats/overview', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const blockchainVerifiedUsers = await User.countDocuments({ isBlockchainVerified: true });
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'super_admin'] } });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          verifiedUsers,
          blockchainVerifiedUsers,
          activeUsers,
          adminUsers,
          recentRegistrations
        },
        usersByRole
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
});

export default router;
