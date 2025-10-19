# Medium Clone - Full Stack Blogging Platform

A modern, full-featured blogging platform built with React, Node.js, Express, and MongoDB. This Medium clone includes user authentication, post creation, image/video uploads, AI chat functionality, and much more.

![Medium Clone Preview](https://github.com/user-attachments/assets/2ea71f11-aea7-436b-8dd7-32bf486be499)
## Features

- **User Authentication** - Sign up, sign in, and profile management
- **Post Creation** - Rich text editor with image and video support
- **Media Uploads** - Image uploads via ImgBB, video uploads via Cloudinary
- **AI Chat** - Integrated AI assistant using OpenRouter API
- **Real-time Updates** - Live likes, comments, and follows
- **Responsive Design** - Mobile-first, modern UI
- **User Profiles** - Customizable profiles with bio and avatar
- **Follow System** - Follow/unfollow users
- **Search Functionality** - Search posts and users
- **Library Management** - Save and organize posts
- **Statistics** - View post analytics and engagement

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **React Quill** - Rich text editor
- **React Toastify** - Notifications
- **Moment.js** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Video storage
- **ImgBB** - Image storage
- **OpenRouter** - AI chat

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account
- **ImgBB** account
- **OpenRouter** account

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd medium-clone
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

**IMPORTANT**: Copy the example environment files and fill in your actual API keys.

The project includes example environment files that you need to copy and configure:

- `.env.example` - Frontend environment template
- `server/.env.example` - Backend environment template

#### Frontend Environment
Copy the example file and create your local environment:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your frontend configuration:

```env
VITE_API_URL=http://localhost:3000
```

#### Backend Environment
Copy the example file and create your server environment:

```bash
# Copy the example file
cd server
cp .env.example .env
```

Edit `server/.env` and add your backend configuration:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medium_clone?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary (for video uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# ImgBB (for image uploads)
IMGBB_API_KEY=your-imgbb-api-key

# OpenRouter (for AI chat)
OPENROUTER_API_KEY=your-openrouter-api-key

# Server
PORT=3000
```

### 4. Get API Keys

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in the connection string

#### Cloudinary
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard → API Keys
4. Copy your Cloud Name, API Key, and API Secret

#### ImgBB
1. Go to [ImgBB](https://imgbb.com/)
2. Sign up for a free account
3. Go to API → Quick start
4. Copy your API key

#### OpenRouter
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Go to API Keys
4. Create a new API key
5. Copy your API key

### 5. Database Setup

The application will automatically create the necessary collections when you first run it. No manual database setup is required.

### 6. Git Configuration

The project includes a comprehensive `.gitignore` file that excludes:
- Environment files (`.env`, `.env.local`, `server/.env`)
- Node modules
- Build outputs
- IDE files
- OS generated files
- Logs and cache files

**Important**: Never commit your actual `.env` files to version control. Only the `.env.example` files should be committed.

## Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Mode

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Start the Backend**
   ```bash
   cd server
   npm start
   ```

## Project Structure

```
medium-clone/
├── public/                 # Static assets
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── Common/        # Shared components
│   │   ├── Home/          # Home page components
│   │   └── Demo/          # Demo page components
│   ├── Context/           # React context
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── server/                # Backend source code
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   └── package.json
├── .env.local            # Frontend environment variables
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments` - Create new comment

### Likes
- `GET /api/likes/:postId` - Get likes for post
- `POST /api/likes` - Like/unlike post

### Uploads
- `POST /api/upload/imgbb` - Upload image to ImgBB
- `POST /api/upload/video` - Upload video to Cloudinary

### AI Chat
- `POST /api/chat` - Send message to AI assistant

## Key Features Explained

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### Post Creation
- Rich text editor with React Quill
- Image and video upload support
- Tag system for categorization
- Draft saving and publishing

### Media Management
- **Images**: Uploaded to ImgBB for fast loading
- **Videos**: Uploaded to Cloudinary with progress tracking
- **Optimization**: Automatic compression and optimization

### AI Chat Integration
- Real-time chat with AI assistant
- Uses OpenRouter API with Qwen model
- Conversation history maintained
- Contextual responses

### Real-time Features
- Live like/unlike functionality
- Real-time comment updates
- Follow/unfollow system
- Instant UI updates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted
   - Verify your database user credentials

2. **Image Upload Issues**
   - Verify your ImgBB API key
   - Check image file size (max 32MB)
   - Ensure image format is supported

3. **Video Upload Issues**
   - Verify your Cloudinary credentials
   - Check video file size (max 100MB)
   - Ensure video format is supported

4. **AI Chat Not Working**
   - Verify your OpenRouter API key
   - Check your API credits
   - Ensure the model is available

5. **Port Already in Use**
   - Change the PORT in your `.env` file
   - Kill the process using the port
   - Use `npx kill-port 3000` to kill port 3000

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Medium](https://medium.com/) for design inspiration
- [React](https://reactjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for media management
- [OpenRouter](https://openrouter.ai/) for AI capabilities

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/medium-clone/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy Coding!**

Made with love by Bilal Alam
