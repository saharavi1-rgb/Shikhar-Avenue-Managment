# Members Dues Dashboard

A full-stack web application for members to login and check their dues.

## Features

✅ User Authentication (Signup/Login)  
✅ Member Dashboard with Dues Overview  
✅ Member Profile Management  
✅ Real-time Dues Status  
✅ Responsive Design  
✅ JWT-based Security  

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL Database
- JWT Authentication
- bcryptjs for Password Hashing
- Express Validator for Input Validation

### Frontend
- React 18
- React Router v6
- Axios for API Calls
- CSS3 for Responsive Styling

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/saharavi1-rgb/Shikhar-Avenue-Managment.git
cd Shikhar-Avenue-Managment

npm install
cd client && npm install && cd ..
```

### Step 2: Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure your PostgreSQL database:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=members_dues
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 3: Create Database & Seed Data

```bash
node scripts/seed.js
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will open at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Test Credentials

After seeding:
- **Email**: john.doe@example.com
- **Password**: password123

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/signup
```

### Members
```
GET /api/members/profile (requires token)
PUT /api/members/profile (requires token)
```

### Dues
```
GET /api/dues (requires token)
GET /api/dues/summary (requires token)
```

## Project Structure

```
Shikhar-Avenue-Managment/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/            # React Components
│   │   ├── api/              # API Service Calls
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── config/                    # Database Configuration
├── middleware/                # Authentication Middleware
├── routes/                    # API Routes
├── scripts/                   # Database Scripts
├── server.js                  # Express Server
├── package.json
├── .env.example
├── Procfile                   # Heroku Configuration
└── README.md
```

## Deployment

### Deploy to Heroku

1. Create Heroku account and install CLI

2. Create new app:
```bash
heroku create your-app-name
```

3. Add PostgreSQL:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
```

5. Deploy:
```bash
git push heroku main
```

## License

MIT