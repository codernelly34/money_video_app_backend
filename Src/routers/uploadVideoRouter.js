const uploadVideo = require('express').Router();
const fileUpload = require('express-fileupload');
const UploadVideo = require('../controllers/uploadVideo');
const verifyAccess = require('../middlewares/verifyAccess');

uploadVideo.use(
   fileUpload({
      useTempFiles: true,
   })
);
uploadVideo.use(verifyAccess);

uploadVideo.route('/upload').post(UploadVideo);

uploadVideo.route('/upload').get((req, res) => {
   res.status(200).json('ok');
});

module.exports = uploadVideo;
