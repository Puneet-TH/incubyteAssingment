require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT;

// Initialize database and start server
const { connectDB } = require('./config/database');
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;

