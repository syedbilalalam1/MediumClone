import express from 'express';
import Like from '../models/Like.js';

const router = express.Router();

// Toggle like on a post
router.post('/', async (req, res) => {
  try {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
      return res.status(400).json({ error: 'Missing required fields: postId, userId' });
    }

    // Check if user already liked this post
    const existingLike = await Like.findOne({ postId, userId });
    
    if (existingLike) {
      // Unlike the post
      await Like.findByIdAndDelete(existingLike._id);
      res.json({ liked: false, message: 'Post unliked' });
    } else {
      // Like the post
      try {
        const newLike = await Like.create({
          postId,
          userId,
          created: Date.now()
        });
        res.json({ liked: true, message: 'Post liked', like: newLike });
      } catch (createError) {
        // Handle duplicate key error
        if (createError.code === 11000) {
          // Duplicate like - this shouldn't happen but handle gracefully
          const existingLike = await Like.findOne({ postId, userId });
          if (existingLike) {
            res.json({ liked: true, message: 'Post already liked', like: existingLike });
          } else {
            res.status(400).json({ error: 'Duplicate like detected' });
          }
        } else {
          throw createError;
        }
      }
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get likes for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ postId });
    res.json(likes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(400).json({ error: error.message });
  }
});

// Check if user liked a specific post
router.get('/:postId/:userId', async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const like = await Like.findOne({ postId, userId });
    res.json({ liked: !!like });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;