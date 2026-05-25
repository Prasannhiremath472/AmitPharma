const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload from local file path
const uploadImage = async (filePath, folder = 'amitmedical') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};

// Upload from in-memory Buffer (multer memoryStorage → Cloudinary)
const uploadBuffer = (buffer, folder = 'amitmedical') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(new Error('Upload failed: ' + error.message));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

// Delete by Cloudinary public_id
const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error('Image deletion failed: ' + error.message);
  }
};

module.exports = { cloudinary, uploadImage, uploadBuffer, deleteImage };
