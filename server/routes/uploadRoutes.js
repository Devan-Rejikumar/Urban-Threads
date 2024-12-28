// backend/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/admin/uploadController.js';  // Import the controller

const router = express.Router();

// Set up multer for handling file uploads (temporary storage location)
const upload = multer({ dest: 'uploads/' });

// POST route to upload image
router.post('/upload', upload.single('image'), uploadImage);

export default router;
