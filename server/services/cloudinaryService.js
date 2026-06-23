const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadImage = async (file) => {
  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'quiz'
      });
      // Remove temporary local file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Failed. Falling back to local storage:', error);
    }
  }

  // Local storage fallback
  // Returns path relative to express root.
  // The server app will host the "uploads" directory statically.
  return `/uploads/${file.filename}`;
};

module.exports = {
  uploadImage
};
