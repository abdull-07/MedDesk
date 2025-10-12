import { uploadImage, deleteImage } from '../config/cloudinary.js';
import User from '../models/user.model.js';

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    // Get current user to check for existing profile picture
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload new image to Cloudinary (using buffer from memory storage)
    const folder = `meddesk/${userRole}s`; // doctors or patients folder
    const uploadResult = await uploadImage(req.file.buffer, folder);

    if (!uploadResult.success) {
      return res.status(500).json({ 
        message: 'Failed to upload image', 
        error: uploadResult.error 
      });
    }

    // Delete old profile picture if exists
    if (user.profilePicture && user.profilePicture.public_id) {
      await deleteImage(user.profilePicture.public_id);
    }

    // Update user profile picture
    user.profilePicture = {
      url: uploadResult.url,
      public_id: uploadResult.public_id
    };

    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profilePicture || !user.profilePicture.public_id) {
      return res.status(400).json({ message: 'No profile picture to delete' });
    }

    // Delete from Cloudinary
    const deleteResult = await deleteImage(user.profilePicture.public_id);
    
    if (!deleteResult.success) {
      return res.status(500).json({ 
        message: 'Failed to delete image from cloud storage',
        error: deleteResult.error 
      });
    }

    // Remove from user profile
    user.profilePicture = undefined;
    await user.save();

    res.json({ message: 'Profile picture deleted successfully' });

  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};