const streamPhotoRouter = require('express').Router();
const { streamThumbnail, streamProfilePic } = require('../../controllers/streamPhoto');

// Route for streaming thumbnails
streamPhotoRouter.route('/get_thumbnail/:thumbnailName').get(streamThumbnail);

// Route for streaming user profile pic
streamPhotoRouter.route('/get_profile_pic/:profilePicName').get(streamProfilePic);

module.exports = streamPhotoRouter;
