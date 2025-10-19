import { Router } from 'express';
import Post from '../models/Post.js';

const router = Router();

// GET /api/posts
router.get('/', async (_req, res) => {
  try {
    const posts = await Post.find({}).sort({ created: -1 }).lean();
    res.json(posts.map(p => ({ ...p, id: String(p._id) })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/posts body:', req.body);
    const { title, desc, postImg, videoUrl, userId, username, tags, kind } = req.body;
    if (!title || !desc || !userId) {
      return res.status(400).json({ error: 'Missing required fields: title, desc, userId' });
    }
    const created = Date.now();
    const post = await Post.create({ 
      title, 
      desc, 
      postImg: postImg || '', 
      videoUrl: videoUrl || '',
      userId, 
      username: username || '', 
      tags: tags || [],
      kind: kind || 'text',
      created 
    });
    console.log('✅ Post created successfully:', { id: post._id, kind, videoUrl: videoUrl || 'none' });
    res.status(201).json({ ...post.toObject(), id: String(post._id) });
  } catch (err) {
    console.error('POST /api/posts error:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ ...post, id: String(post._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH /api/posts/:id
router.patch('/:id', async (req, res) => {
  try {
    const update = req.body || {};
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ ...post, id: String(post._id) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Deleting post:', req.params.id);
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    console.log('✅ Post deleted successfully:', req.params.id);
    res.json({ message: 'Post deleted successfully', id: req.params.id });
  } catch (e) {
    console.error('❌ Delete post error:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;


