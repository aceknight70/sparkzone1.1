# 🔥 Spark Zone - Full Stack Social RPG Platform

<div align="center">
  <img src="https://via.placeholder.com/800x300/22d3ee/ffffff?text=SPARK+ZONE" alt="Spark Zone Banner" />
  
  <p><strong>A social role-playing app where the spark of creativity begins</strong></p>
  
  [![CI/CD](https://github.com/your-username/spark-zone/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/spark-zone/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
</div>

## ✨ Features

### 🎭 Core Platform
- **Character Creation & Management** - Create detailed RPG characters with AI assistance
- **World Building** - Design immersive worlds and settings for storytelling
- **Collaborative Storytelling** - Write and continue stories with other users
- **Social Feed** - Share posts, showcase creations, and engage with the community
- **Real-time Messaging** - Private messages and party chat with live updates

### 🎮 Spark Clash (Card Battle Game)
- **Card Collection System** - Collect and upgrade Spark Cards
- **Deck Building** - Create strategic decks for battles
- **PvP Battles** - Challenge other players in real-time card battles
- **Leaderboards** - Compete for the highest Spark rankings
- **Tournament System** - Participate in organized competitions

### 🤖 AI-Powered Features
- **Character Generation** - AI-assisted character creation with customizable prompts
- **World Generation** - Generate detailed fantasy worlds and settings
- **Story Continuation** - AI helps continue collaborative stories
- **Meme Creation** - Generate meme ideas and templates
- **Content Enhancement** - Smart suggestions for improving creations

### 🌟 Social Features
- **Communities** - Join themed communities for specific interests
- **Parties** - Create and join RPG parties for group storytelling
- **Following System** - Follow favorite creators and see their latest content
- **Notifications** - Real-time updates for interactions and activities
- **Content Discovery** - Explore trending characters, worlds, and stories

### 🛡️ Safety & Moderation
- **Age Rating System** - Content filtering based on age appropriateness
- **Content Warnings** - Clear labeling for sensitive content
- **Blocking & Reporting** - Tools to maintain a safe community
- **Moderation Dashboard** - Admin tools for content management

## 🏗️ Architecture

### Backend Stack
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe development
- **PostgreSQL + Prisma** - Database and ORM
- **Socket.IO** - Real-time WebSocket communication
- **Redis** - Caching and session management
- **Google Gemini AI** - Content generation
- **Cloudinary** - Media storage and processing
- **JWT Authentication** - Secure user sessions

### Frontend Stack
- **React 19 + TypeScript** - Modern UI development
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time features
- **Framer Motion** - Smooth animations

### Infrastructure
- **Docker & Docker Compose** - Containerized deployment
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy and static file serving
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (v7 or higher)
- **Docker & Docker Compose** (optional, for containerized setup)

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/spark-zone.git
cd spark-zone
```

2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# - Database URL
# - JWT Secret
# - Gemini API Key
# - Cloudinary credentials
# - Redis URL

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start the backend server
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/docs

### Docker Setup (Recommended for Production)

```bash
# Copy environment files
cp backend/.env.example backend/.env
# Configure your environment variables in backend/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration

### Required Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/spark_zone_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"

# File Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Caching
REDIS_URL="redis://localhost:6379"

# Server
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (.env)
```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```

## 📚 API Documentation

### Authentication
```typescript
// Register new user
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "name": "Full Name"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Get current user
GET /api/users/profile
Authorization: Bearer <token>
```

### Characters
```typescript
// Create character
POST /api/characters
Authorization: Bearer <token>
{
  "name": "Character Name",
  "description": "Character description",
  "personality": "Personality traits",
  "ageRating": "Everyone"
}

// Browse characters
GET /api/characters?page=1&sortBy=popular&ageRating=Everyone

// Get specific character
GET /api/characters/:characterId
```

### AI Content Generation
```typescript
// Generate character with AI
POST /api/ai/generate/character
Authorization: Bearer <token>
{
  "prompt": "A mysterious wizard from the northern mountains",
  "style": "fantasy",
  "ageRating": "Everyone"
}

// Generate world
POST /api/ai/generate/world
{
  "prompt": "A floating island in the clouds",
  "genre": "fantasy",
  "scope": "region"
}
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

### Frontend Testing
```bash
cd frontend

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Docker Production Deployment

1. **Prepare environment**
```bash
# Copy and configure production environment
cp backend/.env.example backend/.env.production
# Edit .env.production with production values
```

2. **Deploy with Docker Compose**
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f api
```

### Manual Deployment

1. **Backend Deployment**
```bash
cd backend

# Install production dependencies
npm ci --only=production

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start production server
npm start
```

2. **Frontend Deployment**
```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Serve with nginx or your preferred web server
# Build files are in ./dist directory
```

### Environment-Specific Configurations

#### Development
- Hot reloading enabled
- Detailed error messages
- Debug logging
- CORS enabled for localhost

#### Production
- Minified assets
- Compression enabled
- Security headers
- Rate limiting
- Error reporting with Sentry

## 🔐 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** with Joi schemas
- **SQL Injection Protection** with Prisma ORM
- **XSS Prevention** with content sanitization
- **CSRF Protection** with secure headers
- **File Upload Security** with type validation

## 📊 Performance Optimizations

- **Database Indexing** for common queries
- **Redis Caching** for frequently accessed data
- **Image Optimization** with Cloudinary transformations
- **Code Splitting** for faster frontend loading
- **Lazy Loading** for components and routes
- **Database Connection Pooling**
- **Gzip Compression** for API responses
- **CDN Integration** for static assets

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Use conventional commit messages
- Update documentation for API changes
- Ensure code passes linting and tests

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for content generation capabilities
- **Cloudinary** for media storage and processing
- **React Community** for the amazing ecosystem
- **Open Source Contributors** who make projects like this possible

## 📞 Support

- **Documentation**: [docs.sparkzone.com](https://docs.sparkzone.com)
- **Discord Community**: [discord.gg/sparkzone](https://discord.gg/sparkzone)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-username/spark-zone/issues)
- **Email**: support@sparkzone.com

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Voice chat integration
- [ ] Advanced AI story generation
- [ ] NFT integration for premium content
- [ ] Multi-language support
- [ ] Advanced moderation tools

### Version 1.1 (Next Release)
- [ ] Push notifications
- [ ] Advanced search filters
- [ ] User achievements system
- [ ] Content recommendation engine
- [ ] Improved mobile responsiveness
- [ ] Performance optimizations

---

<div align="center">
  <p>Made with ❤️ by the Spark Zone Team</p>
  <p>⭐ Star us on GitHub if you find this project useful!</p>
</div>