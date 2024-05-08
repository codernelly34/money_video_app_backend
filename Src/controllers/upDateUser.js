const asyncHandler = require('express-async-handler');
const userModel = require('../modules/userModel');

// Route handler function for sending user info this is a privet route
//                     Endpoints
// Development at PATCH http://localhost:4040/api/v1/account/details/update_user_info
// Production  at
const upDateUser = asyncHandler(async (req, res) => {
   const UserID = req.user;
   const updateFields = req.body;
   try {

       // Check if any field is present in the req.body
       if (Object.keys(updateFields).length === 0) {
         return res.status(400).json({ message: 'No fields to update' });
     }

       // Assuming userModel has a method like findByIdAndUpdate to update user details
       const updatedUser = await userModel.findOneAndUpdate(UserID, updateFields, { new: true });

       if (!updatedUser) {
          res.status(400).json({ message: 'User not found' });
       }
   } catch (error) {}
});

module.exports = upDateUser;
