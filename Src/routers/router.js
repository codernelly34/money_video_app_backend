const router = require('express').Router();
const UserRoute = require('./userRoutes/UserRouter');
const uploadVideo = require('./MoviesRoutes/uploadVideoRouter');
const videoInfoRoute = require('./MoviesRoutes/videoInfoRouter');
const streamVideoRouter = require('./MoviesRoutes/streamVideoRouter');
const refreshAccessToken = require('../controllers/refreshAccessToken');
const streamThumbnailRouter = require('./MoviesRoutes/streamThumbnailRouter');

// Route to create/login to User account
router.use('/account', UserRoute);

router.use('/video', uploadVideo);

router.use('/thumbnail', streamThumbnailRouter);

router.use('/videoStream', streamVideoRouter);

router.use('/video_info', videoInfoRoute);

router.route('/refresh_access').get(refreshAccessToken);

module.exports = router;
