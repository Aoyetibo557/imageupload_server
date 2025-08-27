const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

// Create a JSON Server instance
const server = jsonServer.create()

// Define the database path (use local db.json in api folder)
const dbPath = path.join(__dirname, 'db.json')

// Check if db.json exists, if not create it with empty structure
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    images: [],
  }, null, 2))
}

// Create router with the local db.json
const router = jsonServer.router(dbPath)

// Use the default middlewares (logger, static, cors and no-cache)
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Add custom middleware for additional CORS if needed
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// URL rewriting
// server.use(jsonServer.rewriter({
//   '/api/*': '/$1'
// }))

// Body parser middleware
server.use(jsonServer.bodyParser)

// Custom endpoints/middleware (add before router)
// Example: Add timestamp to new images
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/images') {
    req.body.uploadedAt = new Date().toISOString()
    req.body.id = Date.now() // Simple ID generation
  }
  next()
})

// Custom endpoint example

// Get all images
server.get('/images', (req, res) => {
  const db = router.db // Get database
  const images = db.get('images').value()
  res.json(images)
})

server.get('/images/stats', (req, res) => {
  const db = router.db // Get database
  const images = db.get('images').value()
  
  res.json({
    total: images.length,
    totalSize: images.reduce((sum, img) => sum + (img.size || 0), 0),
    types: [...new Set(images.map(img => img.type))]
  })
})

// Use router with /api prefix
server.use('/api', router)

// Start server
const PORT = process.env.PORT || 4040
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
  console.log(`API endpoints available at http://localhost:${PORT}/api`)
})