const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');

async function fetchAllImages() {
  try {
    const images = db.get('images').value()
    return images || []
  } catch (error) {
    throw new Error('Failed to fetch images from database')
  }
}

async function fetchImageById(id) {
  try {
    const image = db.get('images').find({ id }).value()
    return image
  } catch (error) {
    throw new Error('Failed to fetch image by ID')
  }
}

async function searchImages(searchTerm) {
  try {
    const images = db.get('images')
      .filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .value()
    return images || []
  } catch (error) {
    throw new Error('Failed to search images')
  }
}

async function createImage(imageData) {
  try {
    const newImage = {
      id: uuidv4(),
      uploadedAt: new Date().toISOString(),
      ...imageData
    }
    
    db.get('images').push(newImage).write()
    return newImage
  } catch (error) {
    throw new Error('Failed to create image')
  }
}

async function deleteImage(id) {
  try {
    const removed = db.get('images').remove({ id }).write()
    return removed.length > 0
  } catch (error) {
    throw new Error('Failed to delete image')
  }
}

async function updateImage(id, imageData) {
  try {
    const existingImage = db.get('images').find({ id }).value()
    if (!existingImage) {
      return null
    }
    
    const updatedImage = db.get('images')
      .find({ id })
      .assign({
        ...imageData,
        updatedAt: new Date().toISOString()
      })
      .write()
    
    return updatedImage
  } catch (error) {
    throw new Error('Failed to update image')
  }
}

module.exports = {
  fetchAllImages,
  fetchImageById,
  searchImages,
  createImage,
  deleteImage,
  updateImage
}