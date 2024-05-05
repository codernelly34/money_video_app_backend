const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const { promisify } = require('util');
const { exec } = require('child_process');
const path = require('path');
const PostModel = require('../modules/postModel');
const { GoogleAuthUser, MainAuthUser } = require('../modules/userModel');

const execPromise = promisify(exec);

// Route handler function to handle video uploading
const UploadVideo = asyncHandler(async (req, res) => {
   // Check if req object has the following (files, name, description)
   if (!req.files || !req.body.name || !req.body.description) {
      res.status(400);
      throw new Error('Name, description, video, and thumbnail are required');
   }

   // Destructure video and the thumbnail from req.files
   const { video, thumbnail } = req.files;

   // Check if video and thumbnail are present
   if (!video || !thumbnail) {
      res.status(400);
      throw new Error('Video and thumbnail files are required');
   }

   try {
      // Check if video and thumbnail are valid video and an image by checking their mimetype
      if (!video.mimetype.startsWith('video') || !thumbnail.mimetype.startsWith('image')) {
         await fs.unlink(video.tempFilePath);
         await fs.unlink(thumbnail.tempFilePath);
         res.status(400);
         throw new Error('Invalid file types, please upload a video and an image');
      }

      const videoName = `${uuidv4()}.mp4`;
      const thumbnailName = `${uuidv4()}.${thumbnail.name.split('.').pop()}`;

      const videoPath = path.join(__dirname, '../', 'medias', 'videos', videoName);
      const thumbnailPath = path.join(__dirname, '../', 'medias', 'thumbnails', thumbnailName);

      const command = `ffmpeg -i ${video.tempFilePath} -c:v libx264 -c:a aac -strict experimental ${videoPath}`;

      await thumbnail.mv(thumbnailPath);
      await execPromise(command);
      await fs.unlink(video.tempFilePath);

      const author = await MainAuthUser.findOne({ username: req.user.username });

      const post = new PostModel({
         name: req.body.name,
         description: req.body.description,
         thumbnail: `http://localhost:4040/api/v1/thumbnail/${thumbnailName}`,
         video: `http://localhost:4040/api/v1/videoStream/${videoName}`,
         author: author._id,
      });

      await post.save();

      res.status(201).json({ message: 'Video uploaded successfully', post });
   } catch (error) {
      res.status(500);
      await fs.unlink(video.tempFilePath);
      await fs.unlink(thumbnail.tempFilePath);
      await fs.unlink(videoPath);
      await fs.unlink(thumbnailPath);
      console.error(error);
      throw new Error('Internal Server Error');
   }
});

module.exports = UploadVideo;
