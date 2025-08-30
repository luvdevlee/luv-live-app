#!/bin/bash

# Server Setup Script for Ubuntu 24.04 LTS
# This script prepares a fresh Ubuntu server for deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

# Update system
update_system() {
    log "Updating system packages..."
    apt update && apt upgrade -y
    success "System updated"
}

# Install Node.js 20.x LTS
install_nodejs() {
    log "Installing Node.js 20.x LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    
    node_version=$(node --version)
    npm_version=$(npm --version)
    success "Node.js installed: $node_version, npm: $npm_version"
}

# Install MongoDB 7.0
install_mongodb() {
    log "Installing MongoDB 7.0..."
    
    # Import MongoDB GPG key
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
       gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    
    # Create MongoDB repository
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    # Install MongoDB
    apt update
    apt install -y mongodb-org
    
    # Start and enable MongoDB
    systemctl start mongod
    systemctl enable mongod
    
    success "MongoDB installed and started"
}

# Redis not needed for this project (using MongoDB Cloud only)
# install_redis() {
#     log "Installing Redis..."
#     apt install -y redis-server
#     
#     # Configure Redis
#     sed -i 's/^# requirepass.*/requirepass redis123/' /etc/redis/redis.conf
#     sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
#     
#     systemctl restart redis-server
#     systemctl enable redis-server
#     
#     success "Redis installed and configured"
# }

# Install Nginx
install_nginx() {
    log "Installing Nginx..."
    apt install -y nginx
    
    systemctl start nginx
    systemctl enable nginx
    
    success "Nginx installed and started"
}

# Install PM2
install_pm2() {
    log "Installing PM2..."
    npm install -g pm2
    
    # Setup PM2 startup script
    pm2 startup systemd -u ubuntu --hp /home/ubuntu
    
    success "PM2 installed"
}

# Install Certbot for SSL
install_certbot() {
    log "Installing Certbot for SSL certificates..."
    apt install -y certbot python3-certbot-nginx
    
    success "Certbot installed"
}

# Install essential tools
install_tools() {
    log "Installing essential tools..."
    apt install -y \
        curl \
        wget \
        git \
        unzip \
        htop \
        tree \
        vim \
        ufw \
        fail2ban \
        logrotate
    
    success "Essential tools installed"
}

# Configure UFW Firewall
configure_firewall() {
    log "Configuring UFW firewall..."
    
    # Reset UFW to default
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow OpenSSH
    
    # Allow HTTP and HTTPS
    ufw allow 'Nginx Full'
    
    # Allow application port
    ufw allow 3000
    
    # Enable UFW
    ufw --force enable
    
    success "Firewall configured"
}

# Create application user
create_app_user() {
    log "Creating application user..."
    
    if ! id -u ubuntu > /dev/null 2>&1; then
        adduser --disabled-password --gecos "" ubuntu
    fi
    
    usermod -aG sudo ubuntu
    
    # Create application directory
    mkdir -p /var/www/luv-app-be
    chown ubuntu:ubuntu /var/www/luv-app-be
    
    # Create log directory
    mkdir -p /var/log/luv-app-be
    chown ubuntu:ubuntu /var/log/luv-app-be
    
    success "Application user and directories created"
}

# Configure SSH security
secure_ssh() {
    log "Securing SSH configuration..."
    
    # Backup original config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Update SSH configuration
    cat > /etc/ssh/sshd_config.secure << EOF
# SSH Security Configuration
Port 22
Protocol 2
PermitRootLogin no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
PasswordAuthentication yes
PubkeyAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
UsePAM yes
EOF
    
    # Apply secure config
    cp /etc/ssh/sshd_config.secure /etc/ssh/sshd_config
    
    # Restart SSH service (Ubuntu 24.04 uses 'ssh' not 'sshd')
    systemctl restart ssh
    
    success "SSH secured"
}

# Configure system limits
configure_limits() {
    log "Configuring system limits..."
    
    cat > /etc/security/limits.d/99-luv-app.conf << EOF
ubuntu soft nofile 65535
ubuntu hard nofile 65535
ubuntu soft nproc 65535
ubuntu hard nproc 65535
EOF
    
    success "System limits configured"
}

# Setup log rotation
setup_logrotate() {
    log "Setting up log rotation..."
    
    cat > /etc/logrotate.d/luv-app-be << EOF
/var/log/luv-app-be/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
        pm2 reloadLogs > /dev/null 2>&1 || true
    endscript
}
EOF
    
    success "Log rotation configured"
}

# Install Docker (optional)
install_docker() {
    log "Installing Docker..."
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add ubuntu user to docker group
    usermod -aG docker ubuntu
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    success "Docker installed"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up basic monitoring..."
    
    # Install and configure htop
    apt install -y htop iotop
    
    # Setup simple health monitoring script
    cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
# Simple health monitoring script

LOG_FILE="/var/log/luv-app-be/health.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check disk usage
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "[$DATE] WARNING: Disk usage is ${DISK_USAGE}%" >> $LOG_FILE
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
    echo "[$DATE] WARNING: Memory usage is ${MEMORY_USAGE}%" >> $LOG_FILE
fi

    # Check if services are running
    services=("nginx")  # Only check nginx (no local MongoDB/Redis)
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet $service; then
            echo "[$DATE] ERROR: $service is not running" >> $LOG_FILE
        fi
    done
EOF
    
    chmod +x /usr/local/bin/health-check.sh
    
    # Add to crontab for regular checks
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh") | crontab -
    
    success "Basic monitoring setup completed"
}

# Main function
main() {
    log "🚀 Starting server setup for Ubuntu 24.04 LTS..."
    
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
        exit 1
    fi
    
    update_system
    install_tools
    install_nodejs
    # install_mongodb  # Not needed - using MongoDB Cloud
    # install_redis    # Not needed - no Redis services yet
    install_nginx
    install_pm2
    install_certbot
    create_app_user
    configure_firewall
    secure_ssh
    configure_limits
    setup_logrotate
    setup_monitoring
    
    # Optional: install Docker
    read -p "Do you want to install Docker? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_docker
    fi
    
    success "🎉 Server setup completed successfully!"
    
    echo -e "\n${GREEN}Next steps:${NC}"
    echo "1. Copy your SSH key to the ubuntu user"
    echo "2. Clone your application repository to /var/www/luv-app-be"
    echo "3. Configure environment variables"
    echo "4. Run the deployment script"
    echo "5. Configure SSL with Certbot"
    
    echo -e "\n${YELLOW}Important information:${NC}"
    echo "- Application directory: /var/www/luv-app-be"
    echo "- Log directory: /var/log/luv-app-be"
    echo "- Using MongoDB Cloud (no local database)"
    echo "- Application will run on port 3000"
    echo "- Nginx is configured and running"
    echo "- Remember to configure your MongoDB Cloud connection string"
}

# Run main function
main "$@"
