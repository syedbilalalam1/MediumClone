import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// POST /api/follows toggle
router.post('/', async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;
    if (!followerId || !followeeId) return res.status(400).json({ error: 'Missing fields' });
    if (followerId === followeeId) return res.status(400).json({ error: 'Cannot follow yourself' });
    const follower = await User.findById(followerId);
    const followee = await User.findById(followeeId);
    if (!follower || !followee) return res.status(404).json({ error: 'User not found' });
    const isFollowing = (follower.followingIds || []).some(id => String(id) === String(followeeId));
    if (isFollowing) {
      follower.followingIds = (follower.followingIds || []).filter(id => String(id) !== String(followeeId));
      followee.followerIds = (followee.followerIds || []).filter(id => String(id) !== String(followerId));
    } else {
      follower.followingIds = [...(follower.followingIds || []), followeeId];
      followee.followerIds = [...(followee.followerIds || []), followerId];
    }
    await follower.save();
    await followee.save();
    res.json({ following: !isFollowing });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


