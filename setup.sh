#!/bin/bash

# Spark Zone - Automated Setup Script
# This script sets up the complete Spark Zone application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        REQUIRED_NODE="18.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
            print_success "Node.js $NODE_VERSION is installed"
        else
            print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        print_success "npm is installed"
    else
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker (optional)
    if command_exists docker; then
        print_success "Docker is installed"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker is not installed. Docker deployment will not be available."
        DOCKER_AVAILABLE=false
    fi
    
    # Check PostgreSQL (if not using Docker)
    if [ "$DOCKER_AVAILABLE" = false ]; then
        if command_exists psql; then
            print_success "PostgreSQL is installed"
        else
            print_error "PostgreSQL is not installed and Docker is not available. Please install PostgreSQL or Docker."
            exit 1
        fi
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Setup environment
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp .env.example .env
        print_warning "Please edit backend/.env with your configuration before running the application!"
    else
        print_warning "Backend .env file already exists. Please verify your configuration."
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Build the application
    print_status "Building backend application..."
    npm run build
    
    print_success "Backend setup completed!"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Setup environment
    if [ ! -f .env ]; then
        print_status "Creating frontend environment file..."
        cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
EOF
        print_success "Created frontend .env file with default values"
    else
        print_warning "Frontend .env file already exists. Please verify your configuration."
    fi
    
    # Build the application
    print_status "Building frontend application..."
    npm run build
    
    print_success "Frontend setup completed!"
    cd ..
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Check if database URL is configured
    if grep -q "your-database-url-here" .env 2>/dev/null; then
        print_error "Please configure DATABASE_URL in backend/.env before running database setup"
        exit 1
    fi
    
    # Run migrations
    print_status "Running database migrations..."
    npx prisma db push
    
    # Optional: Seed database
    if [ -f "prisma/seed.ts" ]; then
        print_status "Seeding database with initial data..."
        npx prisma db seed
    fi
    
    print_success "Database setup completed!"
    cd ..
}

# Docker setup
setup_docker() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Setting up Docker environment..."
        
        # Create docker-compose override for development
        if [ ! -f docker-compose.override.yml ]; then
            cat > docker-compose.override.yml << EOF
version: '3.8'

services:
  api:
    environment:
      - NODE_ENV=development
    volumes:
      - ./backend/src:/app/src
      - ./backend/logs:/app/logs
    command: npm run dev
  
  frontend:
    volumes:
      - ./frontend/src:/app/src
    command: npm run dev
EOF
            print_success "Created docker-compose.override.yml for development"
        fi
        
        print_success "Docker setup completed!"
    fi
}

# Create startup scripts
create_scripts() {
    print_status "Creating startup scripts..."
    
    # Development startup script
    cat > start-dev.sh << 'EOF'
#!/bin/bash

# Start Spark Zone in development mode

echo "🔥 Starting Spark Zone Development Environment..."

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo "❌ Backend .env file not found. Please run setup.sh first."
    exit 1
fi

if [ ! -f frontend/.env ]; then
    echo "❌ Frontend .env file not found. Please run setup.sh first."
    exit 1
fi

# Start services
if command -v docker-compose >/dev/null 2>&1 && [ -f docker-compose.yml ]; then
    echo "🐳 Starting with Docker Compose..."
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Start backend
    echo "🚀 Starting backend..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    
    # Start frontend
    echo "🎨 Starting frontend..."
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
    # Wait for Ctrl+C
    trap 'kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit' INT
    wait
else
    echo "🔧 Starting without Docker (ensure PostgreSQL and Redis are running)..."
    
    # Start backend
    echo "🚀 Starting backend..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    
    # Start frontend
    echo "🎨 Starting frontend..."
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
    # Wait for Ctrl+C
    trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
    wait
fi
EOF
    chmod +x start-dev.sh
    
    # Production startup script
    cat > start-prod.sh << 'EOF'
#!/bin/bash

# Start Spark Zone in production mode

echo "🔥 Starting Spark Zone Production Environment..."

if command -v docker-compose >/dev/null 2>&1 && [ -f docker-compose.yml ]; then
    echo "🐳 Starting with Docker Compose..."
    docker-compose up -d
    echo "✅ Spark Zone is running!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "📡 API: http://localhost:5000"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
else
    echo "❌ Docker Compose not available. Please use Docker for production deployment."
    exit 1
fi
EOF
    chmod +x start-prod.sh
    
    print_success "Created startup scripts (start-dev.sh, start-prod.sh)"
}

# Generate configuration template
generate_config_template() {
    print_status "Generating configuration template..."
    
    cat > CONFIG.md << 'EOF'
# Spark Zone Configuration Guide

## Required Environment Variables

### Backend Configuration (backend/.env)

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/spark_zone_db"

# JWT Authentication
JWT_SECRET="generate-a-strong-secret-key-here"
JWT_EXPIRES_IN="7d"

# Google Gemini AI (for content generation)
GEMINI_API_KEY="your-gemini-api-key"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Redis (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# Server Configuration
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Email Configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Frontend Configuration (frontend/.env)

```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```

## Getting API Keys

### Google Gemini AI
1. Visit https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy the key to GEMINI_API_KEY in your .env

### Cloudinary
1. Sign up at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your .env file

## Database Setup

### PostgreSQL
1. Install PostgreSQL locally or use a cloud service
2. Create a database named 'spark_zone_db'
3. Update DATABASE_URL with your connection string

### Redis
1. Install Redis locally or use a cloud service
2. Update REDIS_URL with your connection string

## Security Notes

- Generate a strong JWT_SECRET (at least 64 characters)
- Use environment-specific values for production
- Never commit .env files to version control
- Use HTTPS in production
- Enable firewall rules for your database
EOF
    
    print_success "Created CONFIG.md with detailed configuration instructions"
}

# Main setup function
main() {
    echo "🔥 Spark Zone - Automated Setup Script"
    echo "======================================"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the root directory of the Spark Zone project"
        exit 1
    fi
    
    # Check requirements
    check_requirements
    
    # Setup components
    setup_backend
    setup_frontend
    setup_docker
    create_scripts
    generate_config_template
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    print_warning "IMPORTANT: Before starting the application, please:"
    print_warning "1. Edit backend/.env with your database and API credentials"
    print_warning "2. Ensure PostgreSQL and Redis are running (or use Docker)"
    print_warning "3. Review CONFIG.md for detailed configuration instructions"
    echo ""
    print_status "To start the development environment:"
    print_status "  ./start-dev.sh"
    echo ""
    print_status "To start with Docker (production-like):"
    print_status "  ./start-prod.sh"
    echo ""
    print_status "To setup the database after configuring .env:"
    print_status "  cd backend && npx prisma db push"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main "$@"