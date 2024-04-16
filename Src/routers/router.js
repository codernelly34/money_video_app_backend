const { Router } = require('express');
const userRoute = require('./userRouter');
const uploadVideo = require('./uploadVideoRouter');
const streamThumbnailRouter = require('./streamThumbnailRouter');
const videoInfoRoute = require('./videoInfoRouter');
const UserInfo = require('./userInfo');
const streamVideoRouter = require('./streamVideoRouter');

const router = Router();

router.use('/account', userRoute);
router.use('/user_info', UserInfo);
router.use('/video', uploadVideo);
router.use('/thumbnail', streamThumbnailRouter);
router.use('/videoStream', streamVideoRouter);
router.use('/video_info', videoInfoRoute);

module.exports = router;
