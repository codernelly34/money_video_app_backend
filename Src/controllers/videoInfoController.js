const asyncHandler = require('express-async-handler');
const PostModel = require('../modules/postModel');

const videoInfo = asyncHandler(async (req, res) => {
   try {
      let query = PostModel.find({});

      const numberOfVideoInfo = 2;

      if (req.body.index != null) {
         query = query.where('_id').gt(req.body.index);
      }

      let videoInfoLimit = await query.limit(numberOfVideoInfo).exec();

      const formattedVideoInfo = await Promise.all(
         videoInfoLimit.map(async (doc) => {
            const populatedDoc = await PostModel.populate(doc, { path: 'author' });
            return {
               index: doc.id,
               thumbnail: doc.thumbnail,
               video_name: doc.name,
               description: doc.description,
               author_photo: doc.author.profilePic,
               author_name: doc.author.name,
            };
         })
      );

      res.status(200).json(formattedVideoInfo);
   } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error('Internal Server Error');
   }
});

module.exports = videoInfo;
