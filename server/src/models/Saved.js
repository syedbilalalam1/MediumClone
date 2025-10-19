import mongoose from 'mongoose';

const SavedSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

SavedSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Saved', SavedSchema);


