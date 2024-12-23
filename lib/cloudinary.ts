/* eslint-disable @typescript-eslint/no-require-imports */
const cloudinary = require('cloudinary').v2;
/* eslint-enable @typescript-eslint/no-require-imports */

// Set up the Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export { cloudinary };