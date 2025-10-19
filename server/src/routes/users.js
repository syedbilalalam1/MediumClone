import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json(users.map(u => ({ ...u, id: String(u._id) })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, email, avatar, bio } = req.body;
    const user = await User.create({ username, email, avatar, bio });
    res.status(201).json({ ...user.toObject(), id: String(user._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/users/:id - Get individual user
router.get('/:id', async (req, res) => {
  try {
    console.log('👤 Fetching user:', req.params.id);
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log('✅ User found:', user.username);
    res.json({ ...user, id: String(user._id) });
  } catch (e) {
    console.error('❌ User fetch error:', e);
    res.status(400).json({ error: e.message });
  }
});

// PATCH /api/users/:id - Update user profile
router.patch('/:id', async (req, res) => {
  try {
    console.log('👤 Updating user profile:', req.params.id, req.body);
    const { username, bio, userImg } = req.body;
    
    if (!username || !bio) {
      return res.status(400).json({ error: 'Username and bio are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, userImg },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User profile updated successfully:', user.username);
    res.json({ ...user, id: String(user._id) });
  } catch (e) {
    console.error('❌ User update error:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;


