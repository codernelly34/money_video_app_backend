const path = require('path');
const mime = require('mime-types');
const fsPromise = require('fs');
const myLogger = require('../modules/logger');

// Route handler function for streaming video thumbnails
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/photo/get_thumbnail/:thumbnailName)
// Production uri ()
const streamThumbnail = async (req, res) => {
   // Get the thumbnail name from the req query
   const thumbnailName = req.params.thumbnailName;
   // Set the image file path
   const imagePath = path.join(__dirname, '../', 'medias', 'thumbnails', thumbnailName);
   try {
      // Set the appropriate headers for streaming image
      const contentType = mime.contentType(path.extname(imagePath));
      res.setHeader('Content-Type', contentType);

      // Create a read stream for the image file
      const imageStream = fsPromise.createReadStream(imagePath);

      // Stream the image to the response object
      imageStream.pipe(res, { end: false });

      // End the response once the image is streamed
      imageStream.on('end', () => {
         res.end();
      });
   } catch (err) {
      // Handle any unexpected errors
      myLogger(err);
      res.status(500);
      throw new Error('Internal Server Error');
   }
};

// Route handler function for streaming user profile pic
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/photo/get_profile_pic/:profilePicName)
// Production uri ()
const streamProfilePic = async (req, res) => {
   // Get the thumbnail name from the req query
   const profilePicName = req.params.profilePicName;
   // Set the image file path
   const imagePath = path.join(__dirname, '../', 'medias', 'profilePhoto', profilePicName);
   try {
      // Set the appropriate headers for streaming image
      const contentType = mime.contentType(path.extname(imagePath));
      res.setHeader('Content-Type', contentType);

      // Create a read stream for the image file
      const imageStream = fsPromise.createReadStream(imagePath);

      // Stream the image to the response object
      imageStream.pipe(res, { end: false });

      // End the response once the image is streamed
      imageStream.on('end', () => {
         res.end();
      });
   } catch (err) {
      // Handle any unexpected errors
      myLogger(err);
      res.status(500);
      throw new Error('Internal Server Error');
   }
};

module.exports = { streamThumbnail, streamProfilePic };
