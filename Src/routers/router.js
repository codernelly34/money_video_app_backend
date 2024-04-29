const router = require('express').Router();
const UserRoute = require('./userRoutes/UserRouter');
const uploadVideo = require('./MoviesRoutes/uploadVideoRouter');
const streamThumbnailRouter = require('./MoviesRoutes/streamThumbnailRouter');
const videoInfoRoute = require('./MoviesRoutes/videoInfoRouter');
const UserInfo = require('./userInfo');
const streamVideoRouter = require('./MoviesRoutes/streamVideoRouter');

// Route to create/login to User account
router.use('/account', UserRoute);

router.use('/user_info', UserInfo);

router.use('/video', uploadVideo);

router.use('/thumbnail', streamThumbnailRouter);

router.use('/videoStream', streamVideoRouter);

router.use('/video_info', videoInfoRoute);

module.exports = router;
