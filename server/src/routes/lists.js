import { Router } from 'express';
import List from '../models/List.js';

const router = Router();

// GET /api/lists - Get all lists for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    
    const lists = await List.find({ userId }).sort({ created: -1 });
    res.json(lists.map(list => ({ ...list.toObject(), id: String(list._id) })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/lists - Create a new list
router.post('/', async (req, res) => {
  try {
    const { name, description, isPrivate, userId, username } = req.body;
    if (!name || !userId || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const list = await List.create({
      name,
      description: description || '',
      isPrivate: isPrivate || false,
      userId,
      username,
      created: Date.now()
    });
    
    res.status(201).json({ ...list.toObject(), id: String(list._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/lists/:id - Get a specific list
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json({ ...list.toObject(), id: String(list._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH /api/lists/:id - Update a list
router.patch('/:id', async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { name, description, isPrivate },
      { new: true }
    );
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json({ ...list.toObject(), id: String(list._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/lists/:id - Delete a list
router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/lists/:id/posts - Add post to list
router.post('/:id/posts', async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ error: 'Missing postId' });
    
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    
    if (!list.postIds.includes(postId)) {
      list.postIds.push(postId);
      await list.save();
    }
    
    res.json({ ...list.toObject(), id: String(list._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/lists/:id/posts/:postId - Remove post from list
router.delete('/:id/posts/:postId', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    
    list.postIds = list.postIds.filter(id => id !== req.params.postId);
    await list.save();
    
    res.json({ ...list.toObject(), id: String(list._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
