import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Updated function to handle file upload with a custom file name (public_id)
export async function uploadFileToCloudinary(file, publicId = null) {
  return new Promise((resolve, reject) => {
    const reader = file.arrayBuffer(); // Convert file to buffer

    reader
      .then((buffer) => {
        const uploadOptions = {
          resource_type: "raw", // Change resource type for non-image files
        };

        // If publicId (file name) is provided, set it in the upload options
        if (publicId) {
          uploadOptions.public_id = publicId;
        }

        cloudinary.uploader
          .upload_stream(uploadOptions, (error, result) => {
            if (result) {
              resolve(result.secure_url); // Return the uploaded file's URL
            } else {
              reject(error);
            }
          })
          .end(Buffer.from(buffer));
      })
      .catch(reject);
  });
}
