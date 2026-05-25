# MediCare Store - Deployment Guide

## Prerequisites

- VPS/Cloud Server with Ubuntu 20.04+
- Node.js 18+
- MySQL 8.0+
- Nginx
- PM2 (Process Manager)
- SSL Certificate (Let's Encrypt)

---

## Step 1: Server Setup

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

---

## Step 2: Database Setup

```bash
# Login to MySQL
sudo mysql

# Run as root:
CREATE DATABASE medicarestore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'medicareuser'@'localhost' IDENTIFIED BY 'StrongPassword@2024';
GRANT ALL PRIVILEGES ON medicarestore.* TO 'medicareuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u medicareuser -p medicarestore < /var/www/MediCareStore/database/medicarestore.sql
```

---

## Step 3: Backend Deployment

```bash
# Clone/upload your code to server
cd /var/www/MediCareStore/backend

# Install dependencies
npm install --production

# Create production .env
cp .env .env.production

# Edit environment variables
nano .env
```

**Production .env settings:**
```env
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_USER=medicareuser
DB_PASSWORD=StrongPassword@2024
DB_NAME=medicarestore
JWT_SECRET=<generate-strong-64-char-secret>
JWT_REFRESH_SECRET=<generate-another-strong-secret>
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-business@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=MediCare Store
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-live-key-id
RAZORPAY_KEY_SECRET=your-live-key-secret
FRONTEND_URL=https://yourdomain.com
```

```bash
# Start with PM2
pm2 start server.js --name medicare-backend
pm2 startup
pm2 save
```

---

## Step 4: Frontend Build & Deployment

```bash
cd /var/www/MediCareStore/frontend

# Install dependencies
npm install

# Create production .env
cat > .env << EOF
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=your-live-razorpay-key
VITE_APP_NAME=MediCare Store
EOF

# Build for production
npm run build

# Copy dist to Nginx web root
sudo cp -r dist/* /var/www/html/
```

---

## Step 5: Nginx Configuration

```bash
# Main site config
sudo nano /etc/nginx/sites-available/medicare-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# API config
sudo nano /etc/nginx/sites-available/medicare-backend
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        client_max_body_size 10M;
    }
}
```

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/medicare-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/medicare-backend /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 6: SSL Certificate

```bash
# Install SSL for both domains
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is handled automatically by certbot
```

---

## Step 7: Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## Step 8: Gmail App Password Setup

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords → Select "Mail" and "Other (Custom name)"
4. Enter "MediCare Store" and generate
5. Use the 16-character code as `SMTP_PASS`

---

## Step 9: Razorpay Live Setup

1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Live API Keys
4. Update `.env` with live keys
5. Configure webhooks: `https://api.yourdomain.com/api/razorpay/webhook`

---

## Monitoring & Maintenance

```bash
# View logs
pm2 logs medicare-backend

# Monitor process
pm2 monit

# Restart if needed
pm2 restart medicare-backend

# Zero-downtime reload
pm2 reload medicare-backend

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Performance Optimization

### MySQL Optimization (my.cnf)
```ini
[mysqld]
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M
query_cache_size = 64M
max_connections = 100
```

### PM2 Cluster Mode (for multi-core)
```bash
pm2 start server.js --name medicare-backend -i max
```

---

## Backup Strategy

```bash
# Database backup (add to cron)
mysqldump -u medicareuser -p medicarestore > /backups/db_$(date +%Y%m%d).sql

# Automated daily backup
crontab -e
0 2 * * * mysqldump -u medicareuser -pPassword medicarestore > /backups/db_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend not starting | Check `pm2 logs` for errors |
| Database connection failed | Verify MySQL credentials and host |
| Email not sending | Check Gmail App Password, check spam folder |
| Payment failing | Verify Razorpay keys and webhook setup |
| Images not uploading | Check Cloudinary credentials |
| CORS errors | Add domain to FRONTEND_URL in backend .env |

---

## Security Checklist

- [x] JWT secrets are long and random (64+ chars)
- [x] Database password is strong and unique
- [x] SSL/HTTPS enabled on all domains
- [x] Rate limiting configured (100 req/15min)
- [x] Helmet.js security headers enabled
- [x] CORS restricted to frontend domain
- [x] Firewall configured (UFW)
- [x] Admin default password changed
- [x] File upload size limited (5MB)
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (output sanitization)

---

*MediCare Store Deployment Guide - Production Ready*
