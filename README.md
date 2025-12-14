# Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory, built with Express.js (Node.js) backend and React frontend. This project demonstrates Test-Driven Development (TDD), RESTful API design, JWT authentication, and modern frontend development practices.

## 🔗 Live Demo

**Live Link**: [https://assingmentfrontend.vercel.app/login](https://assingmentfrontend.vercel.app/login)  

## 🎯 Features

### Backend API
- **User Authentication**: Registration and login with JWT token-based authentication
- **Sweets Management**: Full CRUD operations for managing sweets
- **Search & Filter**: Search sweets by name, category, and price range
- **Inventory Management**: Purchase and restock functionality
- **Role-Based Access Control**: Admin-only endpoints for delete and restock operations
- **Comprehensive Testing**: High test coverage with Jest and Supertest

### Frontend Application
- **User Registration & Login**: Secure authentication flow
- **Dashboard**: Browse all available sweets with search and filter capabilities
- **Purchase Functionality**: Purchase sweets with automatic inventory updates
- **Admin Panel**: Full CRUD interface for managing sweets (admin only)
- **Responsive Design**: Modern, mobile-friendly UI with gradient styling
- **Real-time Updates**: Instant feedback on all operations

## 🏗️ Project Structure

```
assingment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # SQLite database configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── sweetsController.js # Sweets CRUD logic
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth routes
│   │   │   └── sweets.js            # Sweets routes
│   │   ├── __tests__/
│   │   │   ├── auth.test.js         # Auth API tests
│   │   │   └── sweets.test.js       # Sweets API tests
│   │   └── server.js                # Express server setup
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SweetCard.jsx
│   │   │   └── SweetForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sweet_shop
```

**Note**: Make sure MongoDB is installed and running on your system. You can use MongoDB Atlas (cloud) or install MongoDB locally.

4. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

5. (Optional) Create an admin user:
```bash
npm run create-admin
# Or with custom credentials:
npm run create-admin <username> <email> <password>
```

6. Run tests:
```bash
npm test
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ username, email, password }`
  - Returns: `{ token, user }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Sweets (Protected - Requires JWT Token)

- `GET /api/sweets` - Get all sweets
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of sweets

- `GET /api/sweets/search` - Search sweets
  - Query params: `name`, `category`, `minPrice`, `maxPrice`
  - Returns: Filtered array of sweets

- `GET /api/sweets/:id` - Get single sweet by ID
  - Returns: Sweet object

- `POST /api/sweets` - Create a new sweet
  - Body: `{ name, category, price, quantity }`
  - Returns: Created sweet object

- `PUT /api/sweets/:id` - Update a sweet
  - Body: `{ name?, category?, price?, quantity? }`
  - Returns: Updated sweet object

- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)
  - Returns: `{ message: "Sweet deleted successfully" }`

### Inventory (Protected)

- `POST /api/sweets/:id/purchase` - Purchase a sweet
  - Body: `{ quantity }`
  - Returns: `{ message, sweet }`

- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)
  - Body: `{ quantity }`
  - Returns: `{ message, sweet }`

## 🧪 Testing

The backend includes comprehensive test coverage using Jest and Supertest. Tests follow TDD principles and cover:

- User registration and login
- Authentication middleware
- All CRUD operations for sweets
- Search functionality
- Purchase and restock operations
- Admin-only access control

Run tests with:
```bash
cd backend
npm test
```

View coverage report:
```bash
npm test -- --coverage
```

## 🎨 Frontend Features

### User Dashboard
- View all available sweets in a responsive grid layout
- Search by name, category, or price range
- Purchase sweets (disabled when out of stock)
- Real-time inventory updates

### Admin Panel
- Create, update, and delete sweets
- Restock inventory
- Full CRUD interface with modal forms
- Role-based access control

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control (Admin vs User)
- Input validation with express-validator
- SQL injection prevention with parameterized queries

## 📊 Database Schema

### Users Collection
- `_id` (ObjectId - auto-generated)
- `username` (String, unique, required, minlength: 3)
- `email` (String, unique, required, lowercase)
- `password` (String, required - hashed with bcrypt)
- `role` (String, enum: ['user', 'admin'], default: 'user')
- `createdAt` (Date - auto-generated)
- `updatedAt` (Date - auto-generated)

### Sweets Collection
- `_id` (ObjectId - auto-generated)
- `name` (String, required)
- `category` (String, required)
- `price` (Number, required, min: 0)
- `quantity` (Number, required, min: 0, default: 0)
- `createdAt` (Date - auto-generated)
- `updatedAt` (Date - auto-generated)

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Jest** - Testing framework
- **Supertest** - API testing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling with modern gradients

## 📝 My AI Usage

### AI Tools Used
I utilized **Cursor AI** (powered by Claude) little bit for the development of this project. Cursor AI served as my primary coding assistant and pair programming partner.

### How I Used AI

1. **Project Structure & Boilerplate Generation**
   - Used Cursor AI to generate the initial project structure for both backend and frontend
   - Generated Express.js server setup, route configurations, and middleware structure
   - Created React component templates and context providers

2. **Frontend Component Development**
   - AI helped create React components with proper state management
   - Generated form components with validation logic
   - Assisted in implementing authentication context and protected routes

3. **Code Review & Refactoring**
   - Used AI to review code for potential bugs and improvements
   - AI suggested better error handling patterns
   - Helped refactor code to follow SOLID principles

4. **Documentation**
   - AI assisted in writing comprehensive README documentation
   - Generated API endpoint documentation
   - Helped structure the project documentation
   
**Responsible Usage:**
- I reviewed and understood all AI-generated code before committing
- I tested all features thoroughly, regardless of AI assistance
- I maintained ownership and responsibility for the final codebase
- I used AI as a tool to enhance my productivity, not replace my thinking

**Conclusion:**
AI was an invaluable tool in this project, acting as a force multiplier that allowed me to focus on higher-level architecture and problem-solving while handling routine implementation details. However, I maintained full understanding and control over the codebase, ensuring quality and correctness throughout the development process.

## 📸 Screenshots

*Note: Screenshots would be added here showing the application in action*

## 🚢 Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- Render
- AWS EC2

Make sure to:
- Set environment variables (PORT, JWT_SECRET)
- Use a production database (PostgreSQL recommended for production)
- Enable CORS for your frontend domain

### Frontend Deployment
The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

