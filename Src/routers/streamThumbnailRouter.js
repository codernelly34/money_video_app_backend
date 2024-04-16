const streamThumbnail = require("../controllers/streamThumbnail");
const streamThumbnailRouter = require("express").Router();

streamThumbnailRouter.route("/:thumbnailName").get(streamThumbnail);

module.exports = streamThumbnailRouter;
