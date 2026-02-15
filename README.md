Play Before Retire

A full-stack sports event management platform built with Next.js, Supabase, AWS EC2, Nginx, and PM2.

Live Website:
https://playbeforeretire.com

🚀 Project Overview

Play Before Retire is a sports-tech platform where:

Users can explore sports

Register for matches (Individual / Team)

Book cricket matches

Receive confirmation

Founder receives booking email notification

Hosted on AWS with production SSL

🏗️ Tech Stack

Frontend:

Next.js 16

React

Tailwind CSS

Backend:

Next.js API Routes

Supabase (Auth + Database)

Nodemailer (Booking email notification)

Infrastructure:

AWS EC2 (Ubuntu 24.04)

Nginx (Reverse Proxy)

PM2 (Process Manager)

Let’s Encrypt (SSL via Certbot)

Domain: Hostinger DNS

🌍 Production Architecture

User → Domain (Hostinger DNS)
→ AWS EC2 Public IP
→ Nginx (Port 80/443)
→ Next.js App (Port 3000)
→ Supabase Backend
→ Email Notification via Gmail SMTP

🔐 Authentication

Supabase Auth

Email verification enabled

Profiles stored in Supabase DB

Protected routes use Supabase server session

📩 Booking Email System

When a user confirms booking:

API route: /app/api/booking/route.ts

Uses Nodemailer

Sends email to: playbeforeretire@gmail.com

SMTP:

Gmail App Password used

Stored securely in .env.local

☁️ AWS Deployment Steps
1️⃣ Create EC2 Instance

Ubuntu 24.04

t2.micro (Free tier)

Security Group:

22 (SSH)

80 (HTTP)

443 (HTTPS)

3000 (temporary during setup)

2️⃣ SSH into EC2
ssh -i key.pem ubuntu@EC2_PUBLIC_IP

3️⃣ Install Node + Git
sudo apt update
sudo apt install nodejs npm git -y

4️⃣ Clone Repository
git clone https://github.com/yourusername/playbeforeretire
cd playbeforeretire/frontend

5️⃣ Add Environment Variables

Create:

nano .env.local


Add:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
RESEND_API_KEY=...
EMAIL_USER=playbeforeretire@gmail.com
EMAIL_PASS=your_app_password


Save.

6️⃣ Install Dependencies
npm install


If TypeScript error for nodemailer:

npm install --save-dev @types/nodemailer

7️⃣ Add Swap (Important for t2.micro)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile


Check:

free -h

8️⃣ Build Production
npm run build

9️⃣ Start with PM2
sudo npm install -g pm2
pm2 start npm --name "playbeforeretire" -- start
pm2 save
pm2 startup


Run the generated command from pm2 startup.

Verify:

pm2 status

🌐 Nginx Reverse Proxy

Create config:

sudo nano /etc/nginx/sites-available/playbeforeretire


Paste:

server {
    listen 80;
    server_name playbeforeretire.com www.playbeforeretire.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}


Save:

CTRL + O → Enter
CTRL + X

Enable:

sudo ln -s /etc/nginx/sites-available/playbeforeretire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

🔒 SSL Installation (HTTPS)

Install:

sudo apt install certbot python3-certbot-nginx -y


Run:

sudo certbot --nginx -d playbeforeretire.com -d www.playbeforeretire.com


Choose:

Enter email

Agree to terms

Redirect HTTP → HTTPS

Test renewal:

sudo certbot renew --dry-run

🌍 DNS Setup (Hostinger)

Add A records:

Type	Host	Points To
A	@	EC2 Public IP
A	www	EC2 Public IP
🔁 How to Update Website
Step 1 — Modify Locally
npm run dev


Test.

Step 2 — Push to GitHub
git add .
git commit -m "Update"
git push

Step 3 — Update on EC2

SSH:

cd ~/playbeforeretire
git pull
cd frontend
npm install   # if needed
npm run build
pm2 restart playbeforeretire


Website updated.

🛠 Maintenance Commands

Check logs:

pm2 logs


Restart app:

pm2 restart playbeforeretire


Check nginx:

sudo systemctl status nginx


Check memory:

free -h

📌 Current Features

Landing page

Sports listing

Cricket Single Match (Active)

Registration (Individual ₹200 / Team ₹2000)

Booking confirmation page

Email notification to founder

User login system (Supabase)

Turf registration page

Production HTTPS

📈 Future Improvements

Payment integration (Razorpay / Stripe)

Admin dashboard

Tournament management

User analytics

CI/CD auto deployment

Cloudflare CDN

Horizontal scaling

👨‍💻 Founder Note

This entire system was:

Designed

Built

Deployed

Secured

Productionized

By a solo founder.
