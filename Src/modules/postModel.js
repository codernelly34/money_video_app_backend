const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'Proved a name for the video'],
      },
      description: {
         type: String,
         default: 'No description available',
      },
      thumbnail: String,
      video: String,
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
      },
   },
   { timestamps: true }
);

const PostModel = mongoose.model('posts', PostSchema);

module.exports = PostModel;
