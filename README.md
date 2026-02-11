# Sports Event Management System - Backend

A comprehensive backend API for managing sports events, teams, matches, and tournaments with real-time features.

## 🚀 Features

- **User Authentication**: JWT-based auth with email/phone verification
- **Team Management**: Create teams, manage members, democratic captain voting
- **Match System**: Challenge teams, schedule matches, live scoring
- **Tournament Management**: Create and manage tournaments with automated brackets
- **Payment Integration**: Razorpay integration for match services and tournament fees
- **Real-time Updates**: Socket.io for live match updates and team chat
- **Email/SMS Notifications**: AWS SES and Twilio integration
- **File Uploads**: AWS S3 integration for logos and images
- **Cricket Statistics**: Comprehensive player and team stats tracking

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 6+
- AWS Account (for S3, SES)
- Razorpay Account (for payments)
- Twilio Account (for SMS) or AWS SNS

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration values. See [Environment Variables](#environment-variables) section.

### 4. Set up database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed
```

### 5. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── auth.controller.js
│   ├── team.controller.js
│   ├── match.controller.js
│   └── ...
├── middleware/         # Express middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validator.js
├── models/            # Database models (Prisma)
├── routes/            # API routes
│   ├── auth.routes.js
│   ├── team.routes.js
│   └── ...
├── services/          # Business logic
│   ├── email.service.js
│   ├── sms.service.js
│   ├── payment.service.js
│   └── socket.service.js
├── utils/             # Utility functions
│   └── logger.js
├── validators/        # Request validation
│   └── auth.validators.js
├── prisma/            # Database schema
│   └── schema.prisma
├── logs/              # Application logs
├── server.js          # Application entry point
└── package.json
```

## 🔑 Environment Variables

See `.env.example` for all required environment variables.

### Essential Variables

```env
# Application
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sports_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# AWS (for S3, SES)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
AWS_SES_FROM_EMAIL=noreply@yourdomain.com

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/send-email-verification` - Send email OTP
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/send-phone-verification` - Send phone OTP
- `POST /api/auth/verify-phone` - Verify phone with OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:userId` - Get user by ID

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - Search teams
- `GET /api/teams/:teamId` - Get team details
- `PUT /api/teams/:teamId` - Update team
- `DELETE /api/teams/:teamId` - Delete team
- `GET /api/teams/:teamId/members` - Get team members
- `POST /api/teams/:teamId/members` - Add team member
- `DELETE /api/teams/:teamId/members/:memberId` - Remove member
- `POST /api/teams/:teamId/join-request` - Request to join team
- `GET /api/teams/:teamId/join-requests` - Get join requests
- `PUT /api/teams/:teamId/join-requests/:requestId` - Accept/reject request

### Matches
- `GET /api/matches` - Get matches
- `GET /api/matches/:matchId` - Get match details
- `PUT /api/matches/:matchId` - Update match
- `DELETE /api/matches/:matchId` - Cancel match

### Challenges
- `POST /api/challenges` - Create challenge
- `GET /api/challenges` - Get challenges
- `GET /api/challenges/:challengeId` - Get challenge details
- `POST /api/challenges/:challengeId/accept` - Accept challenge
- `POST /api/challenges/:challengeId/reject` - Reject challenge
- `POST /api/challenges/:challengeId/counter-propose` - Counter propose

### Tournaments
- `POST /api/tournaments` - Create tournament (admin)
- `GET /api/tournaments` - Get tournaments
- `GET /api/tournaments/:tournamentId` - Get tournament details
- `POST /api/tournaments/:tournamentId/register` - Register team
- `DELETE /api/tournaments/:tournamentId/register/:registrationId` - Withdraw

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/webhook` - Payment webhook
- `POST /api/payments/:paymentId/verify` - Verify payment
- `GET /api/payments` - Get payment history
- `GET /api/payments/:paymentId` - Get payment details

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

See full API documentation at `/api-docs` (when server is running)

## 🔌 WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }
});
```

### Team Chat
```javascript
// Join team chat
socket.emit('join_team_chat', { teamId: 'uuid' });

// Send message
socket.emit('team_message', { teamId: 'uuid', message: 'Hello!' });

// Receive messages
socket.on('team_message', (data) => {
  console.log(data);
});
```

### Live Match Updates
```javascript
// Join match
socket.emit('join_match', { matchId: 'uuid' });

// Receive score updates
socket.on('score_update', (data) => {
  console.log('Score:', data);
});

// Receive match events
socket.on('match_event', (data) => {
  console.log('Event:', data);
});
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Using PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name sports-backend

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Using Docker

```bash
# Build image
docker build -t sports-backend .

# Run container
docker run -d -p 5000:5000 --env-file .env sports-backend
```

### AWS Deployment

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed AWS Free Tier deployment instructions.

## 📊 Database Schema

The application uses Prisma ORM with PostgreSQL. Key entities:

- **Users** - User accounts and authentication
- **UserProfiles** - User profile information
- **Teams** - Sports teams
- **TeamMembers** - Team membership
- **Matches** - Scheduled matches
- **MatchChallenges** - Match challenges between teams
- **Tournaments** - Tournament events
- **Payments** - Payment records
- **Notifications** - User notifications
- **CricketPlayerStats** - Cricket statistics

See `prisma/schema.prisma` for complete schema.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- SQL injection protection (Prisma)
- XSS protection
- CSRF protection
- Payment webhook signature verification

## 📝 Logging

Logs are stored in the `logs/` directory:
- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled rejections

Logs rotate daily and are kept for 14 days.

## 🐛 Debugging

```bash
# Enable debug mode
DEBUG=* npm run dev

# Check application logs
pm2 logs sports-backend

# Monitor application
pm2 monit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@playbeforeretire.com or join our Slack channel.

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- User authentication with email/phone verification
- Team management system
- Match challenge system
- Tournament management
- Payment integration
- Real-time features
- Cricket statistics

## 🚧 Roadmap

- [ ] Mobile app integration
- [ ] Multi-sport support (Football, Basketball, etc.)
- [ ] Advanced analytics dashboard
- [ ] Video streaming integration
- [ ] AI-powered team recommendations
- [ ] Referee/umpire management
- [ ] Ground booking system
- [ ] Player marketplace
