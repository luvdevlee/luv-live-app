# LUV App Backend - Deployment Guide

This guide will help you deploy the LUV App Backend on Ubuntu 24.04 VPS at Digital Ocean.

## 🚀 Quick Start

### Prerequisites

- Ubuntu 24.04 VPS at Digital Ocean
- SSH access to your VPS
- Domain name (optional but recommended for production)

### Automated Deployment

1. **Connect to your VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Create a non-root user (recommended):**
   ```bash
   adduser luvuser
   usermod -aG sudo luvuser
   su - luvuser
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/luv-app-be.git
   cd luv-app-be
   ```

4. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

5. **Configure environment variables:**
   ```bash
   nano .env
   ```

## 📋 Manual Deployment Steps

If you prefer manual deployment, follow these steps:

### 1. System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
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
```

### 2. Install Docker

```bash
# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in for group changes to take effect
```

### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Configure Firewall

```bash
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
```

### 5. Setup Application

```bash
# Create application directory
sudo mkdir -p /opt/luv-app
sudo chown $USER:$USER /opt/luv-app
cd /opt/luv-app

# Copy application files
cp -r /path/to/your/luv-app-be/* .

# Create SSL directory
sudo mkdir -p /etc/nginx/ssl
sudo chown $USER:$USER /etc/nginx/ssl

# Create logs directory
mkdir -p logs
```

### 6. Configure Environment

Create `.env` file:

```bash
nano .env
```

Add the following configuration:

```env
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://mongo:27017/luv-app

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com,https://your-api-domain.com

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
```

### 7. Generate SSL Certificate

For development (self-signed):
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=VN/ST=Hanoi/L=Hanoi/O=LUV App/OU=IT/CN=your-domain.com"
```

For production (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 8. Deploy Application

```bash
# Build and start services
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Application port | Yes | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `CORS_ORIGIN` | Allowed CORS origins | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `1d` |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Yes | - |
| `JWT_REFRESH_EXPIRES_IN` | JWT refresh expiration | No | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes | - |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | Yes | - |
| `FRONTEND_URL` | Frontend application URL | Yes | - |
| `THROTTLE_TTL` | Rate limiting time window | No | `60` |
| `THROTTLE_LIMIT` | Rate limiting requests per window | No | `100` |

### SSL Configuration

For production, replace the self-signed certificate with a real one:

1. **Using Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Using your own certificate:**
   ```bash
   # Copy your certificate files
   sudo cp your-cert.pem /etc/nginx/ssl/cert.pem
   sudo cp your-key.pem /etc/nginx/ssl/key.pem
   sudo chown $USER:$USER /etc/nginx/ssl/*
   ```

## 🐳 Docker Commands

### Basic Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app

# Check service status
docker-compose ps

# Rebuild and start
docker-compose up -d --build
```

### Maintenance Commands

```bash
# Update application
git pull
docker-compose up -d --build

# Backup database
docker-compose exec mongo mongodump --out /data/backup/$(date +%Y%m%d)

# Restore database
docker-compose exec mongo mongorestore /data/backup/20240101

# Clean up unused images
docker image prune -f

# Clean up unused volumes
docker volume prune -f
```

## 📊 Monitoring

### Health Checks

The application includes health checks for all services:

- **Application:** `http://localhost:3000/health`
- **MongoDB:** Database connection check
- **Redis:** Cache connection check

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mongo
docker-compose logs -f redis
docker-compose logs -f nginx

# View logs with timestamps
docker-compose logs -f -t
```

### Performance Monitoring

```bash
# Check resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h

# Monitor system resources
htop
```

## 🔒 Security

### Firewall Configuration

```bash
# Check firewall status
sudo ufw status

# Allow additional ports if needed
sudo ufw allow 8080/tcp

# Block specific IP
sudo ufw deny from 192.168.1.100
```

### SSL/TLS Security

- Use strong SSL certificates
- Enable HSTS headers
- Configure secure cipher suites
- Regular certificate renewal

### Application Security

- Use strong JWT secrets
- Implement rate limiting
- Enable CORS properly
- Use environment variables for secrets
- Regular security updates

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   sudo netstat -tulpn | grep :3000
   sudo kill -9 <PID>
   ```

2. **Permission denied:**
   ```bash
   sudo chown -R $USER:$USER /opt/luv-app
   ```

3. **Docker service not running:**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

4. **SSL certificate issues:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Debug Commands

```bash
# Check container status
docker-compose ps

# Check container logs
docker-compose logs app

# Enter container for debugging
docker-compose exec app sh

# Check network connectivity
docker-compose exec app ping mongo

# Check database connection
docker-compose exec mongo mongosh
```

## 📈 Scaling

### Horizontal Scaling

To scale the application:

1. **Update docker-compose.yml:**
   ```yaml
   app:
     deploy:
       replicas: 3
   ```

2. **Use Docker Swarm:**
   ```bash
   docker swarm init
   docker stack deploy -c docker-compose.yml luv-app
   ```

### Load Balancing

The Nginx configuration supports load balancing. Add more app instances:

```nginx
upstream backend {
    server app:3000;
    server app2:3000;
    server app3:3000;
}
```

## 🔄 Backup & Recovery

### Database Backup

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/luv-app/backups"
mkdir -p $BACKUP_DIR

docker-compose exec mongo mongodump --out /data/backup/$DATE
docker cp luv-app-mongo:/data/backup/$DATE $BACKUP_DIR/
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh
```

### Automated Backups

Add to crontab:
```bash
crontab -e
# Add this line for daily backups at 2 AM
0 2 * * * /opt/luv-app/backup.sh
```

## 📞 Support

For issues and questions:

1. Check the logs: `docker-compose logs -f`
2. Review this documentation
3. Check the application logs in `/opt/luv-app/logs`
4. Contact the development team

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

---

**Note:** This deployment guide is specifically designed for Ubuntu 24.04 VPS at Digital Ocean. For other environments, some modifications may be required.
