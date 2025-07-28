const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

// Create a JSON Server instance
const server = jsonServer.create()

const router = jsonServer.router('db.json')

// Check if db.json exists, if not create it
const dbPath = path.join(__dirname, 'db.json')
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}))
}



// Use the default middlewares (logger, static, cors and no-cache)
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/api': '/'
}))

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000')
})
