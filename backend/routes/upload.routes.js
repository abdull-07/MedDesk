import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadProfilePicture, deleteProfilePicture } from '../controllers/upload.controller.js';

const router = express.Router();

// Configure multer for file uploads (using memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// All routes require authentication
router.use(authenticateToken);

// Upload profile picture
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

// Delete profile picture
router.delete('/profile-picture', deleteProfilePicture);

export default router;