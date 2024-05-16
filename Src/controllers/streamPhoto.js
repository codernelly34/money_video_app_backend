const path = require('path');
const mime = require('mime-types');
const fs = require('fs');

// Route handler function for streaming video thumbnails
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/photo/get_thumbnail/:thumbnailName)
// Production uri ()
const streamThumbnail = (req, res) => {
   // Get the thumbnail name from the req query
   const thumbnailName = req.params.thumbnailName;

   // Set the image file path
   const imagePath = path.join(__dirname, '../', 'medias', 'thumbnails', thumbnailName);

   // Set the appropriate headers for streaming image
   const contentType = mime.contentType(path.extname(imagePath));
   res.setHeader('Content-Type', contentType);

   // Create a read stream for the image file
   const imageStream = fs.createReadStream(imagePath);

   // Stream the image to the response object
   imageStream.pipe(res, { end: false });

   // End the response once the image is streamed
   imageStream.on('end', () => {
      res.end();
   });
};

// Route handler function for streaming user profile pic
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/photo/get_profile_pic/:profilePicName)
// Production uri ()
const streamProfilePic = (req, res) => {
   // Get the profilePic name from the req query
   const profilePicName = req.params.profilePicName;

   // Set the image file path
   const imagePath = path.join(__dirname, '../', 'medias', 'profilePhoto', profilePicName);

   // Set the appropriate headers for streaming image
   const contentType = mime.contentType(path.extname(imagePath));
   res.setHeader('Content-Type', contentType);

   // Create a read stream for the image file
   const imageStream = fs.createReadStream(imagePath);

   // Stream the image to the response object
   imageStream.pipe(res, { end: false });

   // End the response once the image is streamed
   imageStream.on('end', () => {
      res.end();
   });
};

module.exports = { streamThumbnail, streamProfilePic };
