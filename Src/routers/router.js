const router = require('express').Router();
const UserRoute = require('./userRoutes/UserRouter');
const uploadVideo = require('./MoviesRoutes/uploadVideoRouter');
const videoInfoRoute = require('./MoviesRoutes/videoInfoRouter');
const streamVideoRouter = require('./MoviesRoutes/streamVideoRouter');
const streamPhotoRouter = require('./MoviesRoutes/streamPhoto');

// Route for handling all logic about User account
router.use('/account', UserRoute);

router.use('/video', uploadVideo);

// Route for streaming thumbnails and user profile pic
router.use('/photo', streamPhotoRouter);

router.use('/videoStream', streamVideoRouter);

router.use('/video_info', videoInfoRoute);

module.exports = router;
