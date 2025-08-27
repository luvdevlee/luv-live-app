#!/bin/bash

# LUV App Backend Deployment Script for Ubuntu 24.04 VPS
# This script sets up the entire environment and deploys the application

set -e

echo "🚀 Starting LUV App Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    unzip \
    htop \
    ufw

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker $USER
    print_status "Docker installed successfully. Please log out and log back in for group changes to take effect."
else
    print_status "Docker is already installed."
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully."
else
    print_status "Docker Compose is already installed."
fi

# Configure firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
print_status "Firewall configured successfully."

# Create application directory
APP_DIR="/opt/luv-app"
print_status "Creating application directory at $APP_DIR..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files
print_status "Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Create SSL directory
sudo mkdir -p /etc/nginx/ssl
sudo chown $USER:$USER /etc/nginx/ssl

# Create logs directory
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env 2>/dev/null || {
        print_warning "No .env.example found. Creating basic .env file..."
        cat > .env << EOF
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://mongo:27017/luv-app

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://your-frontend-domain.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback

# Frontend Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
EOF
    }
    print_warning "Please edit the .env file with your actual configuration values before starting the application."
fi

# Generate self-signed SSL certificate for development
if [ ! -f /etc/nginx/ssl/cert.pem ]; then
    print_status "Generating self-signed SSL certificate..."
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/key.pem \
        -out /etc/nginx/ssl/cert.pem \
        -subj "/C=VN/ST=Hanoi/L=Hanoi/O=LUV App/OU=IT/CN=localhost"
    sudo chown $USER:$USER /etc/nginx/ssl/*
fi

# Build and start the application
print_status "Building and starting the application..."
sudo docker-compose build
sudo docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service status
print_status "Checking service status..."
sudo docker-compose ps

# Show logs
print_status "Recent application logs:"
sudo docker-compose logs --tail=20 app

print_status "🎉 Deployment completed successfully!"
echo ""
print_status "Application URLs:"
echo "  - HTTP:  http://$(hostname -I | awk '{print $1}'):80"
echo "  - HTTPS: https://$(hostname -I | awk '{print $1}'):443"
echo "  - GraphQL Playground: https://$(hostname -I | awk '{print $1}'):443/graphql"
echo ""
print_status "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Update application: git pull && docker-compose up -d --build"
echo ""
print_warning "Remember to:"
echo "  1. Update the .env file with your actual configuration"
echo "  2. Replace the self-signed SSL certificate with a real one for production"
echo "  3. Configure your domain name in the CORS settings"
echo "  4. Set up proper monitoring and backup solutions"
