import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    postImg: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    kind: { type: String, enum: ['text', 'video'], default: 'text' },
    userId: { type: String, required: true },
    username: { type: String, default: '' },
    pageViews: { type: Number, default: 0 },
    created: { type: Number, default: () => Date.now() }
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);


