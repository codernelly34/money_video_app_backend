const path = require('path');
const fs = require('fs');

const streamThumbnail = (req, res) => {
   const imagePath = path.join(__dirname, '../', 'medias', 'thumbnails', req.params.thumbnailName); // Specify the path to your image file here

   // Check if the image file exists
   fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
         // File not found or some other error occurred
         res.status(404).json('Image not found');
         return;
      }

      // Set the appropriate headers for streaming image
      res.setHeader('Content-Type', 'image/jpeg');

      // Create a read stream for the image file
      const imageStream = fs.createReadStream(imagePath);

      // Stream the image to the response object
      imageStream.pipe(res);
   });
};

module.exports = streamThumbnail;
