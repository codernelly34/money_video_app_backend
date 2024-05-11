const router = require('express').Router();
const UserRoute = require('./userRoutes/UserRouter');
const uploadVideo = require('./MoviesRoutes/uploadVideoRouter');
const videoInfoRoute = require('./MoviesRoutes/videoInfoRouter');
const streamVideoRouter = require('./MoviesRoutes/streamVideoRouter');
const streamThumbnailRouter = require('./MoviesRoutes/streamThumbnailRouter');

// Route for handling all logic about User account
router.use('/account', UserRoute);

router.use('/video', uploadVideo);

router.use('/thumbnail', streamThumbnailRouter);

router.use('/videoStream', streamVideoRouter);

router.use('/video_info', videoInfoRoute);

module.exports = router;
