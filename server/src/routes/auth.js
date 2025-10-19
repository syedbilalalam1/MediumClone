import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields (username, email, password required)' });
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, avatar: avatar || '/profile.jpg', passwordHash: hash });
    const token = jwt.sign({ uid: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: String(user._id), username, email, avatar: user.avatar } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ uid: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, avatar: user.avatar } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


