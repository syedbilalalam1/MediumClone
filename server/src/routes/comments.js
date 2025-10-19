import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// Create a new comment
router.post('/', async (req, res) => {
  try {
    const { postId, userId, username, comment, userImg } = req.body;
    
    console.log('Comment request body:', req.body);
    
    if (!postId || !userId || !comment) {
      return res.status(400).json({ error: 'Missing required fields: postId, userId, comment' });
    }

    const newComment = await Comment.create({
      postId,
      userId,
      username: username || 'Anonymous',
      comment,
      userImg: userImg || '/profile.jpg',
      created: Date.now()
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ created: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body; // User ID to verify ownership
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;