// Status massage to be send alongside with the Error based on the error statusCode
const statusMassage = {
   400: 'Bad Request',
   401: 'Unauthorized',
   403: 'Forbidden',
   404: 'Not Found',
   405: 'Method Not Allowed',
   500: 'Internal Server Error',
};

// create and export errorHandler middleware function at once
module.exports = errorHandler = (error, req, res, next) => {
   // Set the statusMassage based on the res.StatusCode
   const statusMsg = statusMassage[res.statusCode];

   // Include stack tress in development mode and remove it in production mode
   const stack = process.env.NODE_ENV !== 'production' ? error.stack : null;

   // Finally send the Error
   res.json({ statusMsg, message: error.message, stack });
};
