const { 
  fetchAllImages,
  fetchImageById,
  searchImages,
  createImage,
  deleteImage,
  updateImage 
} = require('../models/images');

const fetchAllImagesController = async (req, res) => {
  try {
    // Handle search query
    const { name_like } = req.query;
    
    let images;
    if (name_like) {
      images = await searchImages(name_like);
    } else {
      images = await fetchAllImages();
    }
    
    // Return in format expected by frontend (direct array)
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}

const fetchImageByIdController = async (req, res) => {
  const { id } = req.params;
  
  try {
    const image = await fetchImageById(id);
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

const createImageController = async (req, res) => {
  const imageData = req.body;
  
  // Validate required fields
  if (!imageData || !imageData.url || !imageData.name) {
    return res.status(400).json({
      error: 'Missing required fields: name and url are required'
    });
  }
  
  try {
    const newImage = await createImage(imageData);
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ error: 'Failed to create image' });
  }
}

const deleteImageController = async (req, res) => {
  const { id } = req.params;
  
  if (!id || !id.trim()) {
    return res.status(400).json({
      error: 'Image ID is required'
    });
  }
  
  try {
    const deleted = await deleteImage(id);
    if (deleted) {
      res.status(204).send(); // No content for successful deletion
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}

const updateImageController = async (req, res) => {
  const { id } = req.params;
  const imageData = req.body;
  
  if (!id || !id.trim()) {
    return res.status(400).json({
      error: 'Image ID is required'
    });
  }
  
  try {
    const updatedImage = await updateImage(id, imageData);
    if (updatedImage) {
      res.status(200).json(updatedImage);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
}

module.exports = {
  fetchAllImagesController,
  fetchImageByIdController,
  createImageController,
  deleteImageController,
  updateImageController
}