const express = require('express');
const cors = require('cors');
const { db } = require('./db');

// Import routes
const imagesRoutes = require("./routers/images.routes");

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Default Home page route from the index.html file in the public folder
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Stats endpoint
app.get('/images/stats', (req, res) => {
  try {
    const images = db.get('images').value() || [];
    
    res.json({
      total: images.length,
      totalSize: images.reduce((sum, img) => sum + (img.size || 0), 0),
      types: [...new Set(images.map(img => img.type).filter(Boolean))]
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Use routes
app.use('/images', imagesRoutes);

// 404 handler
app.use('*', (req, res) => {
  // Check if request expects JSON (API call)
  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(404).json({ 
      error: 'Route not found',
      path: req.originalUrl,
      method: req.method
    });
  }
  
  // Browser request - redirect to homepage
  res.redirect('/');
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📷 Images API: http://localhost:${PORT}/images`);
  console.log(`📊 Stats API: http://localhost:${PORT}/images/stats`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});