# AWS Free Tier Deployment Guide

## Overview
This guide will help you deploy the Sports Management backend on AWS using Free Tier resources.

## AWS Free Tier Resources We'll Use

### 1. **EC2 (Compute)**
- **Instance Type:** t2.micro or t3.micro
- **Free Tier:** 750 hours/month for 12 months
- **OS:** Ubuntu 22.04 LTS
- **Usage:** Run Node.js application

### 2. **RDS (Database)**
- **Instance Type:** db.t3.micro or db.t4g.micro
- **Free Tier:** 750 hours/month for 12 months
- **Engine:** PostgreSQL 15
- **Storage:** 20 GB General Purpose (SSD)
- **Usage:** Primary database

### 3. **S3 (File Storage)**
- **Free Tier:** 5 GB storage, 20,000 GET, 2,000 PUT requests/month
- **Usage:** Store team logos, match photos, documents

### 4. **SES (Email Service)**
- **Free Tier:** 62,000 emails/month when sending from EC2
- **Usage:** OTP, notifications, receipts

### 5. **CloudWatch (Monitoring)**
- **Free Tier:** 10 custom metrics, 10 alarms, 5GB log ingestion
- **Usage:** Application monitoring and logging

### 6. **Elastic IP**
- **Free Tier:** 1 Elastic IP (when attached to running instance)
- **Usage:** Static IP for your application

## Prerequisites

1. AWS Account (with Free Tier eligibility)
2. Domain name (optional, can use IP initially)
3. Local machine with SSH client
4. Basic knowledge of terminal/command line

---

## Step 1: Set Up EC2 Instance

### 1.1 Launch EC2 Instance

```bash
# Navigate to EC2 Dashboard in AWS Console
1. Click "Launch Instance"
2. Name: sports-management-backend
3. Select Ubuntu Server 22.04 LTS (Free tier eligible)
4. Instance type: t2.micro
5. Key pair: Create new key pair
   - Name: sports-backend-key
   - Type: RSA
   - Format: .pem
   - Download and save securely
6. Network settings:
   - Create security group: sports-backend-sg
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
   - Allow Custom TCP (port 5000) from anywhere
7. Storage: 30 GB gp3 (Free tier eligible)
8. Launch instance
```

### 1.2 Connect to EC2 Instance

```bash
# Change key permissions
chmod 400 sports-backend-key.pem

# Connect via SSH
ssh -i "sports-backend-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

### 1.3 Install Node.js and Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Install Nginx (Reverse Proxy)
sudo apt install nginx -y

# Install Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Verify Redis
redis-cli ping  # Should return PONG
```

---

## Step 2: Set Up RDS PostgreSQL Database

### 2.1 Create RDS Instance

```
1. Navigate to RDS Dashboard
2. Create database
3. Choose PostgreSQL
4. Template: Free tier
5. Settings:
   - DB instance identifier: sports-db
   - Master username: sportsadmin
   - Master password: <STRONG_PASSWORD>
6. DB instance class: db.t3.micro
7. Storage: 20 GB gp3
8. Connectivity:
   - VPC: Default VPC
   - Public access: Yes
   - VPC security group: Create new
     - Name: sports-db-sg
     - Inbound rule: PostgreSQL (5432) from EC2 security group
9. Additional configuration:
   - Initial database name: sports_db
   - Automated backups: Enable (7 days retention)
10. Create database
```

### 2.2 Configure Security Group

```
1. Go to EC2 > Security Groups
2. Find sports-db-sg
3. Add inbound rule:
   - Type: PostgreSQL
   - Port: 5432
   - Source: sports-backend-sg (EC2 security group)
```

### 2.3 Test Database Connection

```bash
# On EC2 instance
sudo apt install postgresql-client -y

# Connect to RDS
psql -h <RDS_ENDPOINT> -U sportsadmin -d sports_db

# If successful, you'll see PostgreSQL prompt
# Type \q to exit
```

---

## Step 3: Set Up S3 Bucket

### 3.1 Create S3 Bucket

```
1. Navigate to S3
2. Create bucket
3. Bucket name: sports-management-uploads-<YOUR_UNIQUE_ID>
4. Region: ap-south-1 (or your preferred region)
5. Block all public access: Uncheck
   - Acknowledge the warning
6. Bucket Versioning: Enable
7. Create bucket
```

### 3.2 Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sports-management-uploads-YOUR_UNIQUE_ID/*"
    }
  ]
}
```

### 3.3 Enable CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## Step 4: Set Up AWS SES (Email Service)

### 4.1 Verify Email Address

```
1. Navigate to SES (Simple Email Service)
2. Choose region: ap-south-1 (or your region)
3. Email Addresses > Verify a New Email Address
4. Enter: noreply@yourdomain.com
5. Check email and click verification link
```

### 4.2 Request Production Access

```
1. SES > Account Dashboard
2. Request production access
3. Fill out the form:
   - Mail type: Transactional
   - Website URL: Your domain
   - Describe use case: OTP, match notifications, receipts
4. Submit request (usually approved within 24 hours)

Note: In Sandbox mode, you can only send to verified emails.
```

### 4.3 Create IAM User for SES

```
1. Navigate to IAM
2. Users > Add user
3. Username: sports-ses-user
4. Access type: Programmatic access
5. Permissions: Attach policy directly
   - AmazonSESFullAccess
6. Create user
7. Download credentials (Access Key ID & Secret Access Key)
```

---

## Step 5: Deploy Application

### 5.1 Clone Repository

```bash
# On EC2 instance
cd /home/ubuntu
git clone <YOUR_GIT_REPO_URL>
cd sports-management-backend
```

### 5.2 Install Dependencies

```bash
npm install
```

### 5.3 Set Up Environment Variables

```bash
# Create .env file
nano .env

# Add the following (replace with your actual values):
```

```env
NODE_ENV=production
PORT=5000
APP_NAME="Play Before Retire"
APP_URL=http://<YOUR_EC2_PUBLIC_IP>

FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DATABASE_URL="postgresql://sportsadmin:YOUR_PASSWORD@YOUR_RDS_ENDPOINT:5432/sports_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# S3
AWS_S3_BUCKET=sports-management-uploads-YOUR_UNIQUE_ID
AWS_S3_REGION=ap-south-1

# SES
EMAIL_SERVICE=ses
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
AWS_SES_REGION=ap-south-1
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME="Play Before Retire"

# Twilio (or use AWS SNS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# OTP
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# Session
SESSION_SECRET=your_session_secret

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```

Save and exit (Ctrl+X, Y, Enter)

### 5.4 Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed
```

### 5.5 Start Application with PM2

```bash
# Start application
pm2 start server.js --name sports-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Check application status
pm2 status

# View logs
pm2 logs sports-backend

# Monitor application
pm2 monit
```

---

## Step 6: Configure Nginx Reverse Proxy

### 6.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sports-backend
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;  # or your domain

    # Increase upload size limit
    client_max_body_size 10M;

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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Socket.io support
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
    }
}
```

Save and exit.

### 6.2 Enable Site and Restart Nginx

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/sports-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

---

## Step 7: Set Up SSL Certificate (Let's Encrypt)

### 7.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Obtain SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

### 7.3 Auto-renewal

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
```

---

## Step 8: Set Up CloudWatch Monitoring

### 8.1 Install CloudWatch Agent

```bash
# Download agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Create configuration
sudo nano /opt/aws/amazon-cloudwatch-agent/etc/config.json
```

Add this configuration:

```json
{
  "metrics": {
    "namespace": "SportsManagement",
    "metrics_collected": {
      "cpu": {
        "measurement": [
          {"name": "cpu_usage_idle", "rename": "CPU_IDLE", "unit": "Percent"},
          {"name": "cpu_usage_iowait", "rename": "CPU_IOWAIT", "unit": "Percent"}
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          {"name": "used_percent", "rename": "DISK_USED", "unit": "Percent"}
        ],
        "metrics_collection_interval": 60,
        "resources": ["*"]
      },
      "mem": {
        "measurement": [
          {"name": "mem_used_percent", "rename": "MEM_USED", "unit": "Percent"}
        ],
        "metrics_collection_interval": 60
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ubuntu/sports-management-backend/logs/*.log",
            "log_group_name": "/aws/ec2/sports-backend",
            "log_stream_name": "{instance_id}/application"
          }
        ]
      }
    }
  }
}
```

### 8.2 Start CloudWatch Agent

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

---

## Step 9: Set Up Automated Backups

### 9.1 Database Backups

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_HOST="<YOUR_RDS_ENDPOINT>"
DB_NAME="sports_db"
DB_USER="sportsadmin"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
PGPASSWORD="YOUR_PASSWORD" pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_DIR/sports_db_$TIMESTAMP.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/sports_db_$TIMESTAMP.sql s3://your-backup-bucket/db-backups/

# Delete local backup older than 7 days
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete

echo "Backup completed: sports_db_$TIMESTAMP.sql"
```

Make executable:

```bash
chmod +x ~/backup-db.sh
```

### 9.2 Schedule with Cron

```bash
crontab -e

# Add this line (daily backup at 2 AM)
0 2 * * * /home/ubuntu/backup-db.sh >> /home/ubuntu/backup.log 2>&1
```

---

## Step 10: Security Hardening

### 10.1 Update Security Groups

```bash
# EC2 Security Group
- Remove port 5000 from public access
- Allow only 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Restrict SSH to your IP only

# RDS Security Group
- Allow 5432 only from EC2 security group
- Remove all other inbound rules
```

### 10.2 Set Up Firewall (UFW)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### 10.3 Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config

# Change this line:
PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

---

## Step 11: Monitoring and Maintenance

### 11.1 Check Application Health

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs sports-backend --lines 100

# Check Nginx
sudo systemctl status nginx

# Check Redis
redis-cli ping

# Check disk space
df -h

# Check memory
free -m
```

### 11.2 Update Application

```bash
cd /home/ubuntu/sports-management-backend

# Pull latest code
git pull

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Restart application
pm2 restart sports-backend
```

---

## Cost Estimation (After Free Tier)

After 12 months, here's the estimated monthly cost:

| Service | Configuration | Est. Monthly Cost |
|---------|--------------|-------------------|
| EC2 t2.micro | 24/7 running | $8-10 |
| RDS db.t3.micro | 20GB storage | $15-20 |
| S3 | 5GB + requests | $1-2 |
| Data Transfer | ~50GB/month | $5-10 |
| **Total** | | **$30-40/month** |

Ways to reduce costs:
1. Use reserved instances (save 30-40%)
2. Enable auto-scaling
3. Use CloudFront CDN for static assets
4. Optimize database queries
5. Implement proper caching

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs sports-backend

# Check if port 5000 is in use
sudo lsof -i :5000

# Check environment variables
pm2 env 0
```

### Database Connection Issues

```bash
# Test connection
psql -h <RDS_ENDPOINT> -U sportsadmin -d sports_db

# Check security group rules
# Verify RDS endpoint in .env file
```

### Email Not Sending

```bash
# Check SES sandbox mode
# Verify email addresses
# Check IAM permissions
# Review CloudWatch logs
```

### High Memory Usage

```bash
# Check memory
free -m

# Restart application
pm2 restart sports-backend

# Add swap space if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Additional Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## Support

For issues or questions:
1. Check application logs: `pm2 logs`
2. Review CloudWatch metrics
3. Check security groups and network settings
4. Verify environment variables
