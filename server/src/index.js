import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';
import authRouter from './routes/auth.js';
import likesRouter from './routes/likes.js';
import savedRouter from './routes/saved.js';
import followsRouter from './routes/follows.js';
import uploadRouter from './routes/upload.js';
import aiRouter from './routes/ai.js';
import listsRouter from './routes/lists.js';
import chatRouter from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/likes', likesRouter);
app.use('/api/saved', savedRouter);
app.use('/api/follows', followsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/ai', aiRouter);
app.use('/api/lists', listsRouter);
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { dbName: 'medium_clone' })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`API server listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


