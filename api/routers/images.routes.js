const express = require("express");
const {
  fetchAllImagesController,
  fetchImageByIdController,
  createImageController,
  updateImageController,
  deleteImageController
} = require("../controllers/images");

const router = express.Router();

// GET /images - Get all images (supports ?name_like=search)
router.get("/", fetchAllImagesController);

// GET /images/:id - Get specific image
router.get("/:id", fetchImageByIdController);

// POST /images - Create new image
router.post("/", createImageController);

// PATCH /images/:id - Update image (for rename functionality)
router.patch("/:id", updateImageController);

// PUT /images/:id - Replace entire image
router.put("/:id", updateImageController);

// DELETE /images/:id - Delete image
router.delete("/:id", deleteImageController);

module.exports = router;