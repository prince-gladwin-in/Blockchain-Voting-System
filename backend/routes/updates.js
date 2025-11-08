import express from 'express';
import Election from '../models/Election.js';

const router = express.Router();

// @route   GET /api/elections/updates
// @desc    Get latest election updates
// @access  Public
router.get('/updates', async (req, res) => {
  try {
    const updates = await Election.aggregate([
      {
        $unwind: "$updates"
      },
      {
        $sort: {
          "updates.timestamp": -1
        }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          title: "$updates.title",
          content: "$updates.content",
          timestamp: "$updates.timestamp"
        }
      }
    ]);

    res.json(updates);
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get updates'
    });
  }
});

export default router;