import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(array) {
  return array[randomInt(0, array.length - 1)];
}

function sentence(words = 6 + randomInt(0, 6)) {
  const pool = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua vitae suscipit aliquet feugiat hendrerit facilisi imperdiet rhoncus habitant platea dictumst';
  const toks = pool.split(' ');
  const arr = Array.from({ length: words }, () => pick(toks));
  const s = arr.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

function paragraph(sentences = 3 + randomInt(0, 3)) {
  return Array.from({ length: sentences }, () => sentence(8 + randomInt(0, 10))).join(' ');
}

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(MONGODB_URI, { dbName: 'medium_clone' });
  console.log('Connected for seeding');

  const numUsers = 40;
  const numPosts = 120;

  // Clear existing data (optional)
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash('test12345', 10);

  const users = [];
  const firstNames = ['Ava','Olivia','Emma','Sophia','Isabella','Mia','Charlotte','Amelia','Harper','Evelyn','Liam','Noah','William','James','Logan','Benjamin','Mason','Elijah','Oliver','Jacob'];
  const lastNames = ['Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee'];

  for (let i = 0; i < numUsers; i++) {
    const fname = pick(firstNames);
    const lname = pick(lastNames);
    const username = `${fname.toLowerCase()}_${lname.toLowerCase()}_${i + 1}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i + 1}@example.com`;
    const avatar = `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`;
    const bio = sentence(10);
    const u = await User.create({ username, email, avatar, bio, passwordHash });
    users.push(u);
  }
  console.log(`Created ${users.length} users`);

  const tagsPool = ['react', 'javascript', 'web', 'node', 'mongodb', 'tailwind', 'firebase', 'ux', 'design', 'tutorial', 'cloud'];

  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    const author = pick(users);
    const title = sentence(6 + randomInt(0, 4));
    const paras = 2 + randomInt(0, 4);
    const desc = '<p>' + Array.from({ length: paras }, () => paragraph()).join('</p><p>') + '</p>';
    const postImg = Math.random() < 0.6 ? `https://picsum.photos/seed/${i + 1}/800/400` : '';
    const selectedTags = Array.from(new Set(Array.from({ length: randomInt(1, 4) }, () => pick(tagsPool))));
    const created = Date.now() - randomInt(0, 1000 * 60 * 60 * 24 * 30);
    const kind = 'text';
    const p = await Post.create({
      title,
      desc,
      postImg,
      userId: String(author._id),
      username: author.username,
      pageViews: randomInt(0, 500),
      created,
      kind,
      tags: selectedTags
    });
    posts.push(p);
  }
  console.log(`Created ${posts.length} posts`);

  await mongoose.disconnect();
  console.log('Seeding complete');
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});


