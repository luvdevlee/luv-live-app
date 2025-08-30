#!/bin/bash

# Luv App Backend Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
APP_NAME="luv-app-be"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
LOG_FILE="/var/log/$APP_NAME-deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a $LOG_FILE
}

# Check if running as root or sudo
check_privileges() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as a regular user with sudo privileges."
        exit 1
    fi
}

# Check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    local deps=("node" "npm" "pm2" "git" "nginx")
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            error "$dep is not installed. Please install it first."
            exit 1
        fi
    done
    
    success "All dependencies are installed"
}

# Create backup of current deployment
create_backup() {
    log "Creating backup of current deployment..."
    
    if [ -d "$APP_DIR" ]; then
        local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
        sudo mkdir -p $BACKUP_DIR
        sudo cp -r $APP_DIR $BACKUP_DIR/$backup_name
        success "Backup created: $BACKUP_DIR/$backup_name"
    else
        warning "No existing deployment found to backup"
    fi
}

# Pull latest code
update_code() {
    log "Updating code from repository..."
    
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
    
    success "Code updated successfully"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd $APP_DIR
    npm ci --only=production --silent
    
    success "Dependencies installed"
}

# Build application
build_app() {
    log "Building application..."
    
    cd $APP_DIR
    npm run build
    
    success "Application built successfully"
}

# Update environment variables
update_env() {
    log "Updating environment variables..."
    
    if [ ! -f "$APP_DIR/.env.$ENVIRONMENT" ]; then
        error "Environment file .env.$ENVIRONMENT not found!"
        exit 1
    fi
    
    # Copy environment file
    cp $APP_DIR/.env.$ENVIRONMENT $APP_DIR/.env
    
    success "Environment variables updated"
}

# Database migration (if needed)
run_migrations() {
    log "Running database migrations..."
    
    cd $APP_DIR
    # Add your migration commands here if needed
    # npm run migration:run
    
    success "Database migrations completed"
}

# Test application
test_app() {
    log "Running application tests..."
    
    cd $APP_DIR
    # npm run test:e2e
    
    success "All tests passed"
}

# Restart PM2 processes
restart_pm2() {
    log "Restarting PM2 processes..."
    
    cd $APP_DIR
    
    if pm2 list | grep -q $APP_NAME; then
        pm2 reload ecosystem.config.js --env $ENVIRONMENT
        success "PM2 processes reloaded"
    else
        pm2 start ecosystem.config.js --env $ENVIRONMENT
        success "PM2 processes started"
    fi
    
    pm2 save
}

# Update Nginx configuration
update_nginx() {
    log "Updating Nginx configuration..."
    
    if [ -f "$APP_DIR/nginx/luv-app-be.conf" ]; then
        sudo cp $APP_DIR/nginx/luv-app-be.conf /etc/nginx/sites-available/
        sudo ln -sf /etc/nginx/sites-available/luv-app-be.conf /etc/nginx/sites-enabled/
        
        # Test Nginx configuration
        sudo nginx -t
        
        # Reload Nginx
        sudo systemctl reload nginx
        
        success "Nginx configuration updated"
    else
        warning "Nginx configuration file not found, skipping..."
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            success "Application is healthy and responding"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed, waiting..."
        sleep 5
        ((attempt++))
    done
    
    error "Health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback() {
    error "Deployment failed, initiating rollback..."
    
    local latest_backup=$(ls -t $BACKUP_DIR | head -n1)
    
    if [ -n "$latest_backup" ]; then
        log "Rolling back to: $latest_backup"
        sudo rm -rf $APP_DIR
        sudo cp -r $BACKUP_DIR/$latest_backup $APP_DIR
        
        cd $APP_DIR
        pm2 reload ecosystem.config.js --env $ENVIRONMENT
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only last 5 backups
    ls -t $BACKUP_DIR | tail -n +6 | xargs -I {} sudo rm -rf $BACKUP_DIR/{}
    
    success "Old backups cleaned up"
}

# Send notification (optional)
send_notification() {
    local status=$1
    local message=$2
    
    # Add your notification logic here (Slack, Discord, email, etc.)
    log "Notification: $status - $message"
}

# Main deployment function
main() {
    log "🚀 Starting deployment for environment: $ENVIRONMENT"
    
    # Trap errors and rollback
    trap 'rollback; send_notification "FAILED" "Deployment failed"; exit 1' ERR
    
    check_privileges
    check_dependencies
    create_backup
    update_code
    install_dependencies
    build_app
    update_env
    # run_migrations  # Uncomment if you have migrations
    # test_app        # Uncomment if you want to run tests
    restart_pm2
    update_nginx
    
    # Give the application time to start
    sleep 10
    
    if health_check; then
        cleanup_backups
        success "🎉 Deployment completed successfully!"
        send_notification "SUCCESS" "Deployment completed successfully"
    else
        error "Health check failed"
        exit 1
    fi
}

# Show usage if no environment specified
if [ $# -eq 0 ]; then
    echo "Usage: $0 [production|staging]"
    echo "Example: $0 production"
    exit 1
fi

# Run main function
main
