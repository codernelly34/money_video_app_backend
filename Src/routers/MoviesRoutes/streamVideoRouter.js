const streamVideo = require('../../controllers/streamVideo');
const streamVideoRouter = require('express').Router();

streamVideoRouter.route('/:videoName').get(streamVideo);

module.exports = streamVideoRouter;
