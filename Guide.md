# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher) installed
- npm or yarn package manager

## Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy the content below)
# PORT=3000
# JWT_SECRET=your-secret-key-change-in-production
# NODE_ENV=development
# MONGODB_URI=mongodb://localhost:27017/sweet_shop
# 
# Note: Make sure MongoDB is installed and running
# For MongoDB Atlas, use your connection string instead

# Start the server
npm run dev
```

The backend will run on `http://localhost:3000`

## Step 2: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Step 3: Create an Admin User (Optional)

In the backend terminal:

```bash
npm run create-admin
```

This creates an admin user with:
- Username: `admin`
- Email: `admin@example.com`
- Password: `admin123`

## Step 4: Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Register a new user or login
3. Browse sweets on the dashboard
4. If you created an admin user, login with admin credentials to access the Admin Panel

## Testing

To run backend tests:

```bash
cd backend
npm test
```

## Troubleshooting

### Backend won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed (`npm install`)
- Verify the `.env` file exists in the backend directory

### Frontend won't connect to backend
- Ensure the backend is running on port 3000
- Check the Vite proxy configuration in `frontend/vite.config.js`
- Verify CORS is enabled in the backend

### Database errors
- Ensure MongoDB is running: `mongod` (local) or check your MongoDB Atlas connection
- Check your `MONGODB_URI` in the `.env` file
- For MongoDB Atlas: Use your connection string from Atlas dashboard

