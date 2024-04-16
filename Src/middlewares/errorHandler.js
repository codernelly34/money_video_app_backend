const statusCode = {
   400: 'Bad Request',
   401: 'Unauthorized',
   403: ' Forbidden',
   404: 'Not Found',
   405: 'Method Not Allowed',
   500: ' Internal Server Error',
};

module.exports = errorHandler = (error, req, res, next) => {
   const title = statusCode[res.statusCode];
   const stack = process.env.NODE_ENV !== 'production' ? error.stack : null;

   res.json({
      title,
      stack,
      message: error.message,
   });
};
