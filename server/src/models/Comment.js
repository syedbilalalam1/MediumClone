import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  userImg: {
    type: String,
    default: '/profile.jpg'
  },
  created: {
    type: Number,
    default: Date.now
  }
});

export default mongoose.model('Comment', commentSchema);