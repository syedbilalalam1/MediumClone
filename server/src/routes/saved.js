import { Router } from 'express';
import Saved from '../models/Saved.js';

const router = Router();

// GET /api/saved?userId=...
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const saved = await Saved.find({ userId }).lean();
    res.json(saved.map(s => ({ ...s, id: String(s._id) })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch saved posts' });
  }
});

// POST /api/saved toggle
router.post('/', async (req, res) => {
  try {
    const { postId, userId } = req.body;
    if (!postId || !userId) return res.status(400).json({ error: 'Missing fields' });
    const existing = await Saved.findOne({ postId, userId });
    if (existing) {
      await Saved.deleteOne({ _id: existing._id });
      return res.json({ removed: true });
    }
    const s = await Saved.create({ postId, userId });
    res.status(201).json({ ...s.toObject(), id: String(s._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


