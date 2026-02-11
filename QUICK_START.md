# Sports Management System - Complete Backend Package

## 📦 What's Included

This package contains a **production-ready** backend API for the Sports Event Management System with:

### ✅ Complete Features
- User authentication with email/phone OTP verification
- Team management with democratic captain voting
- Match challenge system
- Tournament management
- Payment integration (Razorpay)
- Real-time chat and live match updates (Socket.io)
- Email notifications (AWS SES)
- SMS notifications (Twilio/AWS SNS)
- File uploads (AWS S3)
- Cricket statistics tracking
- Comprehensive logging and monitoring

### ✅ AWS Free Tier Optimized
- Designed to run on AWS Free Tier resources
- PostgreSQL RDS (db.t3.micro)
- EC2 (t2.micro)
- S3 for file storage
- SES for emails
- CloudWatch for monitoring

### ✅ Production-Ready Code
- Secure JWT authentication
- Input validation
- Error handling
- Rate limiting
- CORS protection
- SQL injection prevention
- XSS protection
- Logging with Winston
- Docker support
- PM2 process management

## 🚀 Quick Start (3 Methods)

### Method 1: Local Development (Fastest)

```bash
# 1. Prerequisites
- Install Node.js 18+
- Install PostgreSQL 15+
- Install Redis

# 2. Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# 3. Database
npx prisma generate
npx prisma migrate dev

# 4. Run
npm run dev

# Server running at http://localhost:5000
```

### Method 2: Docker (Easiest)

```bash
# 1. Prerequisites
- Install Docker and Docker Compose

# 2. Setup
cd backend
cp .env.example .env
# Edit .env with your configuration

# 3. Run
docker-compose up -d

# Everything starts automatically!
# Server running at http://localhost:5000
```

### Method 3: AWS Free Tier (Production)

Follow the complete guide in `backend/AWS_DEPLOYMENT_GUIDE.md`

**Quick summary:**
1. Launch EC2 t2.micro instance
2. Create RDS PostgreSQL db.t3.micro
3. Create S3 bucket
4. Configure SES for emails
5. Deploy code with PM2
6. Configure Nginx reverse proxy
7. Setup SSL with Let's Encrypt

**Estimated time:** 1-2 hours
**Monthly cost after 12 months:** $30-40

## 📋 Required Services & Accounts

### Free Tier Services (Included in AWS)
- ✅ AWS Account (free tier)
- ✅ EC2 instance (750 hours/month free)
- ✅ RDS PostgreSQL (750 hours/month free)
- ✅ S3 storage (5GB free)
- ✅ SES emails (62,000/month free from EC2)
- ✅ CloudWatch (free tier monitoring)

### Third-Party Services (Required)
- ⚠️ **Razorpay** (Payment Gateway - Free to setup, transaction fees apply)
  - Sign up: https://razorpay.com
  - Test mode: Free
  - Live mode: 2% transaction fee
  
- ⚠️ **Twilio** (SMS/OTP - Optional)
  - Sign up: https://twilio.com
  - Free trial: $15 credit
  - Alternative: Use AWS SNS (included in AWS)

- 📧 **Domain** (Recommended for production)
  - For professional emails and SSL
  - Cost: $10-15/year

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic handlers
├── middleware/           # Authentication, validation, errors
├── routes/              # API endpoint definitions
├── services/            # Email, SMS, Payment, Socket.io
├── validators/          # Input validation rules
├── prisma/              # Database schema & migrations
│   └── schema.prisma    # Complete DB schema
├── utils/               # Logger and utilities
├── server.js            # Application entry point
├── package.json         # Dependencies
├── .env.example         # Environment template
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker services setup
├── AWS_DEPLOYMENT_GUIDE.md  # Complete AWS guide
└── README.md            # Full documentation
```

## 🔑 Environment Configuration

### Essential Variables (Minimum to start)

```env
# Application
NODE_ENV=development
PORT=5000

# Database (local)
DATABASE_URL=postgresql://user:password@localhost:5432/sports_db

# JWT (generate strong secrets)
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Redis (local)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Production Variables (Full setup)

See `.env.example` for complete list including:
- AWS credentials (S3, SES)
- Razorpay keys
- Twilio credentials
- Rate limiting
- File upload limits
- Logging configuration

## 📊 Database Schema Highlights

### Core Tables
- **users** - User accounts (email, phone, password)
- **user_profiles** - Profile info (name, location, bio)
- **sports** - Available sports (Cricket, Football, etc.)
- **teams** - Sports teams
- **team_members** - Team membership
- **matches** - Scheduled matches
- **match_challenges** - Team challenges
- **tournaments** - Tournament events
- **payments** - Payment records
- **notifications** - User notifications

### Cricket-Specific
- **cricket_player_stats** - Player statistics
- **cricket_scorecards** - Match scorecards
- **cricket_batting_performances** - Batting data
- **cricket_bowling_performances** - Bowling data

**Total: 25+ tables** with complete relationships and indexes

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing (bcrypt, cost 12)
- ✅ Email OTP verification
- ✅ Phone OTP verification
- ✅ Rate limiting (100 requests/15 min)
- ✅ Input validation & sanitization
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Payment webhook signature verification
- ✅ Secure session management

## 📈 Performance Features

- ✅ Redis caching
- ✅ Database query optimization
- ✅ Connection pooling
- ✅ Gzip compression
- ✅ Request logging with Morgan
- ✅ PM2 cluster mode support
- ✅ Graceful shutdown handling
- ✅ Health check endpoints

## 🧪 Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📡 API Overview

### Authentication
- Register, Login, Logout
- Email/Phone OTP verification
- Password reset
- Refresh tokens

### Teams
- Create, update, delete teams
- Manage members
- Join requests
- Captain voting

### Matches
- Create match challenges
- Accept/reject/counter-propose
- Schedule matches
- Live scoring

### Tournaments
- Browse tournaments
- Register teams
- Pay entry fees
- View standings

### Payments
- Razorpay integration
- Webhook handling
- Payment verification
- Receipt generation

### Real-time (Socket.io)
- Team chat
- Live match updates
- Typing indicators
- Online status

**Total: 50+ endpoints**

See `README.md` for complete API documentation.

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres
```

**Redis connection error**
```bash
# Check if Redis is running
redis-cli ping

# Should return PONG
```

**Port already in use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Prisma generate error**
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate
npx prisma generate
```

**NPM install fails**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📚 Documentation Files

1. **README.md** - Complete backend documentation
2. **AWS_DEPLOYMENT_GUIDE.md** - Step-by-step AWS deployment
3. **backend-architecture.md** - Detailed architecture document
4. **QUICK_START.md** - This file
5. **.env.example** - Environment configuration template

## 🎯 Next Steps

### For Local Development:
1. Set up local PostgreSQL and Redis
2. Configure `.env` file
3. Run migrations
4. Start development server
5. Test with frontend or Postman

### For Production Deployment:
1. Read `AWS_DEPLOYMENT_GUIDE.md`
2. Set up AWS account
3. Create RDS database
4. Launch EC2 instance
5. Configure domain and SSL
6. Deploy application
7. Set up monitoring

### For Integration:
1. Frontend already created (sports-management-app.jsx)
2. Update API endpoints in frontend
3. Configure CORS
4. Test authentication flow
5. Implement payment gateway

## 💰 Cost Breakdown

### Development (Local):
- **Cost:** $0/month
- PostgreSQL, Redis run locally

### Production (AWS Free Tier - First 12 months):
- **Cost:** $0-5/month
- Razorpay: Free (pay per transaction)
- Twilio: $15 free credit
- Domain: $1/month (optional)

### Production (After Free Tier):
- **EC2 t2.micro:** $8-10/month
- **RDS db.t3.micro:** $15-20/month
- **S3 + Data Transfer:** $5-10/month
- **Total:** $30-40/month

### Ways to Reduce Costs:
- Use reserved instances (30-40% savings)
- Optimize database queries
- Implement caching
- Use CloudFront CDN
- Enable compression

## 🤝 Support

**Documentation:**
- Backend: `backend/README.md`
- AWS Guide: `backend/AWS_DEPLOYMENT_GUIDE.md`
- Architecture: `backend-architecture.md`

**Help:**
- Check troubleshooting section
- Review error logs in `logs/` directory
- Use `pm2 logs` for runtime logs
- Check CloudWatch for AWS issues

## ✨ Features Comparison

| Feature | Included | Notes |
|---------|----------|-------|
| User Auth | ✅ | JWT with refresh tokens |
| Email Verification | ✅ | OTP via AWS SES |
| Phone Verification | ✅ | OTP via Twilio/SNS |
| Team Management | ✅ | Full CRUD + voting |
| Match System | ✅ | Challenges + scheduling |
| Tournaments | ✅ | Registration + payments |
| Payments | ✅ | Razorpay integration |
| Real-time Chat | ✅ | Socket.io |
| Live Scoring | ✅ | WebSocket updates |
| File Uploads | ✅ | AWS S3 |
| Email Notifications | ✅ | AWS SES |
| SMS Notifications | ✅ | Twilio/AWS SNS |
| Statistics | ✅ | Cricket stats |
| Admin Panel | ⏳ | Coming soon |
| Mobile App API | ✅ | Ready to use |

## 🎉 You're All Set!

Choose your deployment method and get started:

- **Local Dev:** `npm run dev` (5 minutes)
- **Docker:** `docker-compose up` (10 minutes)
- **AWS Production:** Follow AWS guide (1-2 hours)

Questions? Check the documentation files or the troubleshooting section.

**Happy Coding! 🚀**
