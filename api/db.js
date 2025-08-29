const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs')
const path = require('path')

// Define the database path
const dbPath = path.join(__dirname, 'db.json')

// Check if db.json exists, if not create it with empty structure
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    images: []
  }, null, 2))
}

// Create database instance
const adapter = new FileSync(dbPath)
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ images: [] }).write()

module.exports = {
  db
}