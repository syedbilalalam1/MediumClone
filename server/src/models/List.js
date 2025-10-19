import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    description: { type: String, default: '' },
    isPrivate: { type: Boolean, default: false },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    postIds: { type: [String], default: [] },
    created: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('List', ListSchema);
