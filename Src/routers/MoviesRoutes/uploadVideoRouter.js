const uploadVideo = require('express').Router();
const fileUpload = require('express-fileupload');
const UploadVideo = require('../../controllers/uploadVideoController');
const verifyAccess = require('../../middlewares/verifyAccess');

uploadVideo.use(fileUpload({ useTempFiles: true }));

// Protect this route by verifying access to it from the verifyAccess middleware
uploadVideo.use(verifyAccess);

// Route to handle video Uploading
uploadVideo.route('/upload').post(UploadVideo);

// Finally export the uploadVideo route
module.exports = uploadVideo;
