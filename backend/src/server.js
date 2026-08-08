const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const seedData = require('./utils/seed');
const User = require('./models/User');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const chatRoutes = require('./routes/chatRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();

// Connect Database
connectDB().then(async () => {
  // Check if database is empty and auto-seed demo accounts
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty! Auto-seeding initial demo data...');
      await seedData();
    }
  } catch (err) {
    console.warn('Auto-seed check warning:', err.message);
  }
});

// Middleware
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    system: 'MERN Complaint Management Platform API',
    time: new Date().toISOString(),
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
