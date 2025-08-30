# 🚀 Hướng Dẫn Deployment Luv App Backend lên VPS Ubuntu 24.04 LTS

## 📋 Mục Lục
1. [Chuẩn bị VPS tại DigitalOcean](#1-chuẩn-bị-vps-tại-digitalocean)
2. [Thiết lập Server Ubuntu 24.04 LTS](#2-thiết-lập-server-ubuntu-2404-lts)
3. [Cài đặt Dependencies](#3-cài-đặt-dependencies)
4. [Cấu hình MongoDB Cloud](#4-cấu-hình-mongodb-cloud)
5. [Deploy Ứng dụng](#5-deploy-ứng-dụng)
6. [Cấu hình Nginx](#6-cấu-hình-nginx)
7. [Cài đặt SSL với Let's Encrypt](#7-cài-đặt-ssl-với-lets-encrypt)
8. [Monitoring và Backup](#8-monitoring-và-backup)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Chuẩn bị VPS tại DigitalOcean

### 1.1 Tạo Droplet mới
```bash
# Thông số khuyến nghị:
- OS: Ubuntu 24.04 LTS x64
- Plan: Basic - $12/month (2GB RAM, 1 vCPU, 50GB SSD)
- Datacenter: Singapore (gần Việt Nam nhất)
- Additional options: IPv6, Monitoring
- Authentication: SSH Key (khuyến nghị) hoặc Password
```

### 1.2 Kết nối đến VPS
```bash
# Thay your-server-ip bằng IP thực của VPS
ssh root@your-server-ip

# Hoặc nếu đã tạo user ubuntu
ssh ubuntu@your-server-ip
```

---

## 2. Thiết lập Server Ubuntu 24.04 LTS

### 2.1 Chạy script setup tự động
```bash
# Upload script setup lên server
scp scripts/setup-server.sh root@your-server-ip:/tmp/

# Kết nối và chạy script
ssh root@your-server-ip
chmod +x /tmp/setup-server.sh
/tmp/setup-server.sh
```

### 2.2 Setup thủ công (nếu muốn)

#### Cập nhật hệ thống
```bash
sudo apt update && sudo apt upgrade -y
```

#### Cài đặt Node.js 20.x LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Kiểm tra phiên bản
npm --version
```

**Lưu ý:** Project này sử dụng MongoDB Cloud (Atlas), do đó không cần cài đặt MongoDB và Redis local trên server.

#### Cài đặt Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

#### Cài đặt PM2
```bash
sudo npm install -g pm2
```

#### Cài đặt Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Cấu hình Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000
sudo ufw enable
sudo ufw status
```

---

## 3. Cài đặt Dependencies

### 3.1 Tạo user ứng dụng
```bash
sudo adduser ubuntu
sudo usermod -aG sudo ubuntu
sudo mkdir -p /var/www/luv-app-be
sudo chown ubuntu:ubuntu /var/www/luv-app-be
```

### 3.2 Tạo thư mục logs
```bash
sudo mkdir -p /var/log/luv-app-be
sudo chown ubuntu:ubuntu /var/log/luv-app-be
```

---

## 4. Cấu hình MongoDB Cloud

### 4.1 Tạo MongoDB Atlas Cluster
1. **Đăng ký/Đăng nhập MongoDB Atlas**
   - Truy cập: https://cloud.mongodb.com/
   - Tạo tài khoản hoặc đăng nhập

2. **Tạo Cluster mới**
   - Chọn "Build a Database"
   - Chọn "Shared" (Free tier) hoặc "Dedicated" 
   - Chọn Cloud Provider: AWS/GCP/Azure
   - Chọn Region gần Việt Nam (Singapore)
   - Đặt tên cluster: `luv-app-cluster`

3. **Cấu hình Database User**
   - Tạo user với username/password
   - Gán quyền `Read and write to any database`
   - Lưu thông tin đăng nhập

### 4.2 Cấu hình Network Access
```bash
# Whitelist IP addresses
# - Thêm IP của VPS server
# - Hoặc cho phép "0.0.0.0/0" (tất cả IP) cho testing
# - Khuyến nghị: chỉ whitelist IP cụ thể trong production
```

### 4.3 Lấy Connection String
```bash
# Trong Atlas Dashboard:
# 1. Click "Connect" trên cluster
# 2. Chọn "Connect your application"
# 3. Copy connection string
# Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luv-app?retryWrites=true&w=majority

# Example:
MONGODB_URI=mongodb+srv://luvapp:your-password@luv-app-cluster.xxxxx.mongodb.net/luv-app?retryWrites=true&w=majority&appName=Cluster0
```

### 4.4 Test kết nối từ VPS
```bash
# Cài đặt MongoDB tools để test
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.7.0.deb
sudo dpkg -i mongodb-database-tools-ubuntu2004-x86_64-100.7.0.deb

# Test connection
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luv-app"
```

---

## 5. Deploy Ứng dụng

### 5.1 Clone repository
```bash
# Chuyển sang user ubuntu
su - ubuntu

# Clone repository
cd /var/www
git clone https://github.com/your-username/luv-app-be.git
cd luv-app-be
```

### 5.2 Cấu hình Environment Variables
```bash
# Copy file environment example
cp env.production.example .env.production

# Chỉnh sửa các giá trị
nano .env.production

# Cập nhật các giá trị sau:
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://luvapp:your-password@luv-app-cluster.xxxxx.mongodb.net/luv-app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### 5.3 Cài đặt dependencies và build
```bash
npm ci --only=production
npm run build
```

### 5.4 Khởi động với PM2
```bash
# Copy file ecosystem
cp ecosystem.config.js ecosystem.config.production.js

# Chỉnh sửa cấu hình nếu cần
nano ecosystem.config.production.js

# Khởi động ứng dụng
pm2 start ecosystem.config.production.js --env production
pm2 save
pm2 startup
```

### 5.5 Kiểm tra ứng dụng
```bash
pm2 status
pm2 logs luv-app-be
curl http://localhost:3000/health
```

---

## 6. Cấu hình Nginx

### 6.1 Copy cấu hình Nginx
```bash
sudo cp nginx/luv-app-be.conf /etc/nginx/sites-available/
```

### 6.2 Chỉnh sửa cấu hình
```bash
sudo nano /etc/nginx/sites-available/luv-app-be

# Thay thế your-domain.com bằng domain thực của bạn
# Ví dụ: luv-app.example.com
```

### 6.3 Kích hoạt site
```bash
sudo ln -s /etc/nginx/sites-available/luv-app-be /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. Cài đặt SSL với Let's Encrypt

### 7.1 Cấu hình DNS
Trước khi cài SSL, đảm bảo DNS của domain đã trỏ đến IP của VPS:
```bash
# Kiểm tra DNS
nslookup your-domain.com
dig your-domain.com
```

### 7.2 Cài đặt SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Làm theo hướng dẫn trên màn hình
# Chọn option redirect HTTP to HTTPS
```

### 7.3 Cấu hình auto-renewal
```bash
sudo crontab -e

# Thêm dòng sau để auto renewal mỗi ngày lúc 2h sáng
0 2 * * * /usr/bin/certbot renew --quiet
```

### 7.4 Test SSL
```bash
# Test SSL certificate
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run
```

---

## 8. Monitoring và Backup

### 8.1 Cấu hình Log Rotation
```bash
sudo nano /etc/logrotate.d/luv-app-be

# Nội dung:
/var/log/luv-app-be/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs > /dev/null 2>&1 || true
    endscript
}
```

### 8.2 Setup MongoDB Cloud Backup
```bash
# View backup guide cho MongoDB Atlas
chmod +x scripts/backup-mongodb-cloud.sh
./scripts/backup-mongodb-cloud.sh

# MongoDB Atlas tự động backup:
# 1. Continuous Backup (M10+ clusters) - Point-in-time recovery
# 2. Cloud Provider Snapshots - Daily snapshots
# 3. On-demand Snapshots - Manual snapshots

# Cấu hình backup trong Atlas Dashboard:
# 1. Vào cluster -> Backup tab
# 2. Enable Continuous Backup hoặc configure snapshot schedule
# 3. Set retention period (tối thiểu 7 ngày)
# 4. Test restore functionality
```

### 8.3 Monitoring với PM2
```bash
# Cài đặt PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Xem monitoring dashboard
pm2 monit
```

---

## 9. Troubleshooting

### 9.1 Kiểm tra Services
```bash
# Kiểm tra services (chỉ nginx vì không có local database)
sudo systemctl status nginx

# Kiểm tra PM2
pm2 status
pm2 logs luv-app-be

# Kiểm tra ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### 9.2 Kiểm tra Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/luv-app-be.access.log
sudo tail -f /var/log/nginx/luv-app-be.error.log

# Application logs
pm2 logs luv-app-be
tail -f /var/log/luv-app-be/app.log
```

### 9.3 Common Issues

#### Ứng dụng không start được
```bash
# Kiểm tra environment variables
pm2 env 0

# Kiểm tra dependencies
cd /var/www/luv-app-be
npm ls

# Restart ứng dụng
pm2 restart luv-app-be
```

#### MongoDB Cloud connection error
```bash
# Test MongoDB Atlas connection
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luv-app"

# Kiểm tra network connectivity
ping cluster0.xxxxx.mongodb.net

# Kiểm tra environment variables
pm2 env 0

# Common issues:
# 1. IP không được whitelist trong Atlas
# 2. Username/password không đúng
# 3. Connection string format sai
# 4. Network connectivity issues
```

#### Nginx 502 Bad Gateway
```bash
# Kiểm tra upstream server
curl http://localhost:3000/health

# Kiểm tra Nginx config
sudo nginx -t

# Restart services
sudo systemctl restart nginx
pm2 restart luv-app-be
```

---

## 🎯 Deployment Script Automation

Để deploy tự động, sử dụng script có sẵn:

```bash
# Cấp quyền execute
chmod +x deploy.sh

# Deploy production
./deploy.sh production

# Xem logs deployment
tail -f /var/log/luv-app-be-deploy.log
```

---

## 🔧 Performance Optimization

### 1. Nginx Caching
```nginx
# Thêm vào server block
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. PM2 Cluster Mode
```javascript
// Trong ecosystem.config.js
instances: 'max',  // Sử dụng tất cả CPU cores
exec_mode: 'cluster'
```

### 3. MongoDB Atlas Performance
```javascript
// Tạo indexes trong Atlas UI hoặc via connection:
// mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luv-app"

// Tạo indexes cho performance
db.users.createIndex({ email: 1 }, { unique: true })
db.streams.createIndex({ createdAt: -1 })

// MongoDB Atlas cung cấp:
// - Performance Advisor cho index recommendations
// - Real-time performance metrics
// - Profiler để phân tích slow queries
```

---

## 🔒 Security Best Practices

1. **Thay đổi SSH port mặc định**
2. **Cấu hình fail2ban**
3. **Regular security updates**
4. **Strong passwords và JWT secrets**
5. **Rate limiting với Nginx**
6. **MongoDB Atlas security (IP whitelist, VPC peering)**
7. **Regular backups (Atlas automated backups)**
8. **SSL/TLS encryption cho database connections**

---

## 📞 Support

Nếu gặp vấn đề trong quá trình deployment, vui lòng:

1. Kiểm tra logs chi tiết
2. Verify tất cả services đang chạy
3. Test từng component riêng biệt
4. Kiểm tra network connectivity

---

**Chúc bạn deployment thành công! 🚀**
