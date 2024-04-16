const videoInfo = require('../controllers/videoInfoController');
const videoInfoRoute = require('express').Router();

videoInfoRoute.route('/').post(videoInfo);

module.exports = videoInfoRoute;
