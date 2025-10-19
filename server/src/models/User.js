import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    userImg: { type: String, default: '' },
    bio: { type: String, default: '' },
    passwordHash: { type: String }
  },
  { timestamps: true }
);

// follow relations (simple arrays of ObjectId as strings)
UserSchema.add({
  followerIds: { type: [String], default: [] },
  followingIds: { type: [String], default: [] }
});

export default mongoose.model('User', UserSchema);


