import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    default: Date.now
  }
});

// Create compound index to prevent duplicate likes
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);