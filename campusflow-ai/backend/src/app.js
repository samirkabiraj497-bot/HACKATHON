const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/hackathon evaluation
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CampusFlow AI Operations Agent',
    timestamp: new Date().toISOString(),
    aiEngine: 'ACTIVE',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', apiRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
