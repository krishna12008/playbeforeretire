# Sports Event Management System - Backend Architecture

## Technology Stack

### Core Technologies
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL (primary), Redis (caching & sessions)
- **ORM:** Prisma
- **Authentication:** JWT + Passport.js
- **File Storage:** AWS S3 / Cloudinary
- **Payment Gateway:** Razorpay / Stripe
- **Real-time:** Socket.io
- **Email:** SendGrid / AWS SES
- **SMS:** Twilio

### Additional Services
- **API Documentation:** Swagger/OpenAPI
- **Monitoring:** Sentry (error tracking), Prometheus (metrics)
- **Logging:** Winston
- **Testing:** Jest, Supertest
- **Deployment:** Docker, AWS ECS/EC2

---

## Database Schema (PostgreSQL)

### Core Entities

#### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('individual', 'team_manager', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(user_type);
```

#### 2. User Profiles Table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100) DEFAULT 'India',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_profiles_location ON user_profiles(location_city, location_state);
```

#### 3. Sports Table
```sql
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    launch_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate sports
INSERT INTO sports (name, slug, is_active) VALUES
('Cricket', 'cricket', TRUE),
('Football', 'football', FALSE),
('Badminton', 'badminton', FALSE),
('Volleyball', 'volleyball', FALSE),
('Basketball', 'basketball', FALSE),
('Hockey', 'hockey', FALSE),
('Table Tennis', 'table-tennis', FALSE),
('Chess', 'chess', FALSE),
('Carrom', 'carrom', FALSE),
('Swimming', 'swimming', FALSE);
```

#### 4. Teams Table
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id UUID REFERENCES sports(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    home_ground VARCHAR(255),
    captain_id UUID REFERENCES users(id),
    manager_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disbanded')),
    total_members INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    matches_drawn INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teams_sport ON teams(sport_id);
CREATE INDEX idx_teams_location ON teams(location_city, location_state);
CREATE INDEX idx_teams_manager ON teams(manager_id);
```

#### 5. Team Members Table
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50), -- e.g., 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'
    jersey_number INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

#### 6. Team Join Requests Table
```sql
CREATE TABLE team_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id, status)
);

CREATE INDEX idx_join_requests_team ON team_join_requests(team_id, status);
CREATE INDEX idx_join_requests_user ON team_join_requests(user_id, status);
```

#### 7. Captain Voting Table
```sql
CREATE TABLE captain_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES users(id),
    candidate_id UUID REFERENCES users(id),
    vote_session_id UUID NOT NULL, -- Links votes from same voting session
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, voter_id, vote_session_id)
);

CREATE TABLE captain_vote_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    initiated_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);
```

#### 8. Matches Table
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id UUID REFERENCES sports(id),
    match_type VARCHAR(30) CHECK (match_type IN ('friendly', 'competitive', 'tournament')),
    tournament_id UUID REFERENCES tournaments(id),
    team_a_id UUID REFERENCES teams(id),
    team_b_id UUID REFERENCES teams(id),
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_state VARCHAR(100),
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('pending', 'scheduled', 'confirmed', 'live', 'completed', 'cancelled')),
    winner_team_id UUID REFERENCES teams(id),
    result_summary TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matches_date ON matches(match_date, match_time);
CREATE INDEX idx_matches_teams ON matches(team_a_id, team_b_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
```

#### 9. Match Challenges Table
```sql
CREATE TABLE match_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id UUID REFERENCES sports(id),
    challenger_team_id UUID REFERENCES teams(id),
    challenge_type VARCHAR(20) CHECK (challenge_type IN ('specific', 'open')),
    opponent_team_id UUID REFERENCES teams(id), -- NULL for 'open' challenges
    proposed_date DATE NOT NULL,
    proposed_time TIME NOT NULL,
    venue_name VARCHAR(255),
    venue_address TEXT,
    match_type VARCHAR(30) DEFAULT 'friendly',
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'counter_proposed', 'expired')),
    accepted_by_team_id UUID REFERENCES teams(id),
    match_id UUID REFERENCES matches(id), -- Created after acceptance
    message TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_challenges_status ON match_challenges(status);
CREATE INDEX idx_challenges_teams ON match_challenges(challenger_team_id, opponent_team_id);
CREATE INDEX idx_challenges_sport ON match_challenges(sport_id);
```

#### 10. Challenge Counter Proposals Table
```sql
CREATE TABLE challenge_counter_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES match_challenges(id) ON DELETE CASCADE,
    proposed_by_team_id UUID REFERENCES teams(id),
    proposed_date DATE,
    proposed_time TIME,
    proposed_venue VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 11. Match Services Table
```sql
CREATE TABLE match_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    service_type VARCHAR(30) CHECK (service_type IN ('ground', 'equipment', 'umpire', 'scorer', 'streaming')),
    provider_name VARCHAR(255),
    cost DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_match_services_match ON match_services(match_id);
```

#### 12. Tournaments Table
```sql
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport_id UUID REFERENCES sports(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    format VARCHAR(50), -- e.g., 'T20', 'ODI', 'Test', 'League'
    tournament_type VARCHAR(30) CHECK (tournament_type IN ('knockout', 'league', 'round_robin', 'mixed')),
    max_teams INTEGER NOT NULL,
    current_teams INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE NOT NULL,
    registration_end DATE NOT NULL,
    entry_fee DECIMAL(10, 2) DEFAULT 0,
    prize_pool DECIMAL(10, 2),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    venue_name VARCHAR(255),
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled')),
    organizer_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tournaments_sport ON tournaments(sport_id);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournaments_status ON tournaments(status);
```

#### 13. Tournament Registrations Table
```sql
CREATE TABLE tournament_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'withdrawn')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    registered_by UUID REFERENCES users(id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, team_id)
);

CREATE INDEX idx_tournament_regs_tournament ON tournament_registrations(tournament_id);
CREATE INDEX idx_tournament_regs_team ON tournament_registrations(team_id);
```

#### 14. Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    payment_type VARCHAR(30) CHECK (payment_type IN ('match_service', 'tournament_entry', 'subscription', 'other')),
    reference_id UUID, -- ID of match, tournament, etc.
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_gateway VARCHAR(30),
    gateway_transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(30),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_team ON payments(team_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(payment_type, reference_id);
```

#### 15. Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50), -- 'match', 'challenge', 'tournament', etc.
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

#### 16. Team Chat Messages Table
```sql
CREATE TABLE team_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_team ON team_chat_messages(team_id, created_at DESC);
```

#### 17. Player Statistics Table (Cricket-specific)
```sql
CREATE TABLE cricket_player_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id),
    matches_played INTEGER DEFAULT 0,
    
    -- Batting Stats
    innings_batted INTEGER DEFAULT 0,
    runs_scored INTEGER DEFAULT 0,
    balls_faced INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    centuries INTEGER DEFAULT 0,
    half_centuries INTEGER DEFAULT 0,
    not_outs INTEGER DEFAULT 0,
    
    -- Bowling Stats
    innings_bowled INTEGER DEFAULT 0,
    overs_bowled DECIMAL(5, 1) DEFAULT 0,
    runs_conceded INTEGER DEFAULT 0,
    wickets_taken INTEGER DEFAULT 0,
    best_bowling VARCHAR(10),
    five_wicket_hauls INTEGER DEFAULT 0,
    
    -- Fielding Stats
    catches INTEGER DEFAULT 0,
    stumpings INTEGER DEFAULT 0,
    run_outs INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, team_id)
);

CREATE INDEX idx_cricket_stats_user ON cricket_player_stats(user_id);
```

#### 18. Match Scorecards Table (Cricket-specific)
```sql
CREATE TABLE cricket_scorecards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    innings_number INTEGER CHECK (innings_number IN (1, 2, 3, 4)),
    batting_team_id UUID REFERENCES teams(id),
    total_runs INTEGER,
    total_wickets INTEGER,
    total_overs DECIMAL(4, 1),
    extras INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, innings_number)
);

CREATE TABLE cricket_batting_performances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scorecard_id UUID REFERENCES cricket_scorecards(id) ON DELETE CASCADE,
    player_id UUID REFERENCES users(id),
    batting_position INTEGER,
    runs_scored INTEGER DEFAULT 0,
    balls_faced INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    strike_rate DECIMAL(5, 2),
    dismissal_type VARCHAR(50),
    dismissed_by UUID REFERENCES users(id)
);

CREATE TABLE cricket_bowling_performances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scorecard_id UUID REFERENCES cricket_scorecards(id) ON DELETE CASCADE,
    bowler_id UUID REFERENCES users(id),
    overs_bowled DECIMAL(4, 1),
    runs_conceded INTEGER,
    wickets_taken INTEGER,
    economy_rate DECIMAL(4, 2)
);
```

---

## API Endpoints

### Authentication & Users

#### POST /api/auth/register
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "phone": "+919876543210",
  "password": "securePassword123",
  "userType": "individual", // or "team_manager"
  "fullName": "John Doe",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra"
  }
}

Response: 201
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "userType": "individual",
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /api/auth/verify-email
#### POST /api/auth/verify-phone
#### POST /api/auth/refresh-token
#### POST /api/auth/forgot-password
#### POST /api/auth/reset-password

#### GET /api/users/me
Get current user profile

#### PUT /api/users/me
Update user profile

#### GET /api/users/:userId
Get user by ID (public info only)

---

### Sports

#### GET /api/sports
Get all sports
```json
Response: 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cricket",
      "slug": "cricket",
      "isActive": true,
      "icon": "🏏"
    }
  ]
}
```

#### GET /api/sports/:sportId
Get sport details

---

### Teams

#### POST /api/teams
Create a new team
```json
Request:
{
  "sportId": "uuid",
  "name": "Mumbai Warriors",
  "description": "Competitive cricket team",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "homeGround": "Wankhede Stadium"
}

Response: 201
{
  "success": true,
  "data": {
    "teamId": "uuid",
    "name": "Mumbai Warriors",
    "slug": "mumbai-warriors",
    "managerId": "uuid"
  }
}
```

#### GET /api/teams
Search/filter teams
Query params: `?sport=cricket&city=Mumbai&search=warriors&page=1&limit=10`

#### GET /api/teams/:teamId
Get team details with members

#### PUT /api/teams/:teamId
Update team (manager only)

#### DELETE /api/teams/:teamId
Delete team (manager only)

#### GET /api/teams/:teamId/members
Get team members

#### POST /api/teams/:teamId/members
Add team member (manager only)
```json
Request:
{
  "userId": "uuid",
  "role": "batsman",
  "jerseyNumber": 10
}
```

#### DELETE /api/teams/:teamId/members/:memberId
Remove team member (manager only)

#### POST /api/teams/:teamId/join-request
Request to join team
```json
Request:
{
  "message": "I would like to join your team"
}
```

#### GET /api/teams/:teamId/join-requests
Get join requests (manager only)

#### PUT /api/teams/:teamId/join-requests/:requestId
Accept/reject join request
```json
Request:
{
  "action": "accept" // or "reject"
}
```

---

### Captain Voting

#### POST /api/teams/:teamId/captain-vote/initiate
Initiate captain voting (manager only)

#### POST /api/teams/:teamId/captain-vote/:sessionId/vote
Cast vote
```json
Request:
{
  "candidateId": "uuid"
}
```

#### GET /api/teams/:teamId/captain-vote/:sessionId/results
Get voting results

#### POST /api/teams/:teamId/captain-vote/:sessionId/finalize
Finalize voting and set captain (manager only)

---

### Matches

#### GET /api/matches
Get matches with filters
Query params: `?teamId=uuid&status=upcoming&sport=cricket&startDate=2026-03-01&endDate=2026-03-31`

#### GET /api/matches/:matchId
Get match details

#### PUT /api/matches/:matchId
Update match details

#### DELETE /api/matches/:matchId
Cancel match

---

### Match Challenges

#### POST /api/challenges
Create a challenge
```json
Request:
{
  "sportId": "uuid",
  "challengerTeamId": "uuid",
  "challengeType": "specific", // or "open"
  "opponentTeamId": "uuid", // required if challengeType is "specific"
  "proposedDate": "2026-03-15",
  "proposedTime": "14:00:00",
  "venueName": "Wankhede Stadium",
  "venueAddress": "D Road, Churchgate, Mumbai",
  "matchType": "friendly",
  "message": "Let's have a friendly match!",
  "services": [
    {
      "type": "ground",
      "cost": 2000
    },
    {
      "type": "equipment",
      "cost": 500
    }
  ]
}

Response: 201
{
  "success": true,
  "data": {
    "challengeId": "uuid",
    "status": "pending",
    "expiresAt": "2026-03-08T14:00:00Z"
  }
}
```

#### GET /api/challenges
Get challenges for user's teams
Query params: `?teamId=uuid&status=pending&type=received`

#### GET /api/challenges/:challengeId
Get challenge details

#### POST /api/challenges/:challengeId/accept
Accept challenge
```json
Request:
{
  "teamId": "uuid" // for open challenges
}

Response: 200
{
  "success": true,
  "data": {
    "matchId": "uuid",
    "paymentRequired": true,
    "totalAmount": 2500
  }
}
```

#### POST /api/challenges/:challengeId/reject
Reject challenge
```json
Request:
{
  "reason": "Date not suitable"
}
```

#### POST /api/challenges/:challengeId/counter-propose
Counter propose new terms
```json
Request:
{
  "proposedDate": "2026-03-16",
  "proposedTime": "15:00:00",
  "message": "Can we play on the 16th instead?"
}
```

#### POST /api/challenges/:challengeId/counter-proposals/:proposalId/respond
Respond to counter proposal
```json
Request:
  "action": "accept" // or "reject"
}
```

---

### Tournaments

#### POST /api/tournaments
Create tournament (admin only)
```json
Request:
{
  "sportId": "uuid",
  "name": "Summer Cricket Championship 2026",
  "format": "T20",
  "tournamentType": "knockout",
  "maxTeams": 16,
  "startDate": "2026-03-15",
  "endDate": "2026-03-30",
  "registrationStart": "2026-02-01",
  "registrationEnd": "2026-03-10",
  "entryFee": 5000,
  "prizePool": 100000,
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "venue": "Wankhede Stadium"
  },
  "description": "Annual T20 tournament"
}
```

#### GET /api/tournaments
Get tournaments
Query params: `?sport=cricket&status=registration_open&city=Mumbai`

#### GET /api/tournaments/:tournamentId
Get tournament details

#### PUT /api/tournaments/:tournamentId
Update tournament (admin only)

#### DELETE /api/tournaments/:tournamentId
Delete tournament (admin only)

#### POST /api/tournaments/:tournamentId/register
Register team for tournament
```json
Request:
{
  "teamId": "uuid"
}

Response: 201
{
  "success": true,
  "data": {
    "registrationId": "uuid",
    "paymentRequired": true,
    "amount": 5000,
    "paymentUrl": "https://payment-gateway.com/pay/..."
  }
}
```

#### DELETE /api/tournaments/:tournamentId/register/:registrationId
Withdraw from tournament

#### GET /api/tournaments/:tournamentId/teams
Get registered teams

#### GET /api/tournaments/:tournamentId/matches
Get tournament matches

---

### Payments

#### POST /api/payments/initiate
Initiate payment
```json
Request:
{
  "paymentType": "match_service",
  "referenceId": "uuid", // match ID or tournament ID
  "amount": 2500,
  "teamId": "uuid"
}

Response: 200
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "gatewayOrderId": "order_xyz123",
    "paymentUrl": "https://razorpay.com/...",
    "amount": 2500,
    "currency": "INR"
  }
}
```

#### POST /api/payments/webhook
Payment gateway webhook (validates signature)

#### POST /api/payments/:paymentId/verify
Verify payment status

#### GET /api/payments
Get payment history
Query params: `?teamId=uuid&status=completed&type=tournament_entry`

#### GET /api/payments/:paymentId
Get payment details

---

### Notifications

#### GET /api/notifications
Get user notifications
Query params: `?isRead=false&limit=20&offset=0`

#### PUT /api/notifications/:notificationId/read
Mark notification as read

#### PUT /api/notifications/read-all
Mark all notifications as read

#### DELETE /api/notifications/:notificationId
Delete notification

---

### Team Chat

#### GET /api/teams/:teamId/chat/messages
Get chat messages
Query params: `?limit=50&before=messageId`

#### POST /api/teams/:teamId/chat/messages
Send message
```json
Request:
{
  "message": "Great match today!",
  "messageType": "text"
}
```

#### DELETE /api/teams/:teamId/chat/messages/:messageId
Delete message (sender only)

---

### Cricket Statistics

#### GET /api/cricket/players/:userId/stats
Get player statistics

#### GET /api/cricket/teams/:teamId/stats
Get team statistics

#### GET /api/cricket/matches/:matchId/scorecard
Get match scorecard

#### POST /api/cricket/matches/:matchId/scorecard
Create/update scorecard (scorer only)
```json
Request:
{
  "inningsNumber": 1,
  "battingTeamId": "uuid",
  "battingPerformances": [
    {
      "playerId": "uuid",
      "battingPosition": 1,
      "runsScored": 45,
      "ballsFaced": 30,
      "fours": 6,
      "sixes": 1,
      "dismissalType": "caught",
      "dismissedBy": "uuid"
    }
  ],
  "bowlingPerformances": [
    {
      "bowlerId": "uuid",
      "oversBowled": 4.0,
      "runsConceded": 32,
      "wicketsTaken": 2
    }
  ],
  "totalRuns": 165,
  "totalWickets": 8,
  "totalOvers": 20.0
}
```

---

## WebSocket Events (Socket.io)

### Connection
```javascript
// Client connects with auth token
socket.on('connect', () => {
  socket.emit('authenticate', { token: 'jwt_token' });
});
```

### Team Chat
```javascript
// Join team room
socket.emit('join_team_chat', { teamId: 'uuid' });

// Send message
socket.emit('team_message', {
  teamId: 'uuid',
  message: 'Hello team!'
});

// Receive message
socket.on('team_message', (data) => {
  console.log(data.sender, data.message);
});

// Leave team room
socket.emit('leave_team_chat', { teamId: 'uuid' });
```

### Live Match Updates
```javascript
// Join match room
socket.emit('join_match', { matchId: 'uuid' });

// Receive score updates
socket.on('score_update', (data) => {
  console.log('Runs:', data.runs, 'Wickets:', data.wickets);
});

// Receive match events
socket.on('match_event', (data) => {
  console.log(data.eventType, data.description);
});
```

### Notifications
```javascript
// Receive real-time notifications
socket.on('notification', (data) => {
  console.log('New notification:', data.title);
});
```

---

## Background Jobs (Bull Queue)

### Email Jobs
- Welcome email on registration
- Email verification
- Password reset
- Match confirmation
- Tournament registration confirmation
- Payment receipts

### SMS Jobs
- Phone verification OTP
- Match reminders (24 hours before)
- Challenge notifications

### Scheduled Jobs
- Expire old challenges (runs every hour)
- Match reminders (runs every hour)
- Update tournament standings (after each match)
- Generate player statistics (daily)

### Example Job Configuration
```javascript
// Email queue
const emailQueue = new Bull('email', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

emailQueue.process(async (job) => {
  const { to, subject, template, data } = job.data;
  await sendEmail(to, subject, template, data);
});

// Add job
await emailQueue.add({
  to: 'user@example.com',
  subject: 'Welcome to Play Before Retire',
  template: 'welcome',
  data: { name: 'John' }
});
```

---

## Middleware

### Authentication Middleware
```javascript
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};
```

### Team Manager Authorization
```javascript
const isTeamManager = async (req, res, next) => {
  const { teamId } = req.params;
  const team = await Team.findById(teamId);
  
  if (team.managerId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Only team manager can perform this action'
    });
  }
  
  next();
};
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later'
});

app.use('/api/', apiLimiter);
```

### Request Validation
```javascript
const { body, validationResult } = require('express-validator');

const validateCreateTeam = [
  body('name').trim().isLength({ min: 3, max: 255 }),
  body('sportId').isUUID(),
  body('location.city').trim().notEmpty(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

app.post('/api/teams', authMiddleware, validateCreateTeam, createTeam);
```

---

## Error Handling

### Custom Error Classes
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}
```

### Global Error Handler
```javascript
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id
  });

  // Send error to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err);
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

app.use(errorHandler);
```

---

## Security Best Practices

### 1. Password Hashing
```javascript
const bcrypt = require('bcrypt');

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### 2. JWT Configuration
```javascript
const jwt = require('jsonwebtoken');

// Generate access token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};
```

### 3. Input Sanitization
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
```

### 4. CORS Configuration
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 5. Payment Webhook Signature Verification
```javascript
const crypto = require('crypto');

const verifyRazorpaySignature = (req, res, next) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  next();
};

app.post('/api/payments/webhook', verifyRazorpaySignature, handlePaymentWebhook);