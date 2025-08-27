#!/bin/bash

# Script generate Let's Encrypt SSL cert for Docker Nginx
# Author: GPT-5 Chat
# Usage: ./generate-ssl.sh yourdomain.com

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
  echo "❌ Usage: $0 yourdomain.com"
  exit 1
fi

echo "🔑 Generating Let's Encrypt SSL certificate for $DOMAIN ..."

# Update system
sudo apt update -y

# Install certbot
if ! command -v certbot &> /dev/null; then
  echo "📦 Installing Certbot..."
  sudo apt install -y certbot
fi

# Create directory for SSL
SSL_DIR="./ssl"
mkdir -p $SSL_DIR

# Stop nginx container before certbot runs
echo "🛑 Stopping nginx container (if running)..."
docker stop luv-app-nginx || true

# Request SSL cert (standalone mode)
sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

# Copy certs into ./ssl for docker mount
echo "📂 Copying certs into $SSL_DIR ..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem

# Fix permission
sudo chown $USER:$USER $SSL_DIR/*.pem

echo "✅ SSL certificate generated and copied to $SSL_DIR"
echo "   - $SSL_DIR/cert.pem"
echo "   - $SSL_DIR/key.pem"

# Restart nginx container
echo "🚀 Restarting nginx container..."
docker start luv-app-nginx || docker compose up -d nginx

# Setup auto-renew
echo "🕒 Setting up auto-renew cronjob..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem && docker restart luv-app-nginx'") | crontab -

echo "🎉 Done! HTTPS is now enabled for https://$DOMAIN"