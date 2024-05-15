// Status massage to be send alongside with the Error based on the error statusCode
const statusMassage = {
   400: 'Bad Request',
   401: 'Unauthorized',
   403: 'Forbidden',
   404: 'Not Found',
   405: 'Method Not Allowed',
   500: 'Internal Server Error',
};

// create errorHandler middleware function at once
const errorHandler = (err, _req, res, _next) => {
   // Set the statusMassage based on the err.errStatusCode
   const statusMsg = statusMassage[err.errStatusCode];

   // Include stack tress in development mode and remove it in production mode
   const stack = process.env.NODE_ENV !== 'production' ? err.stack : null;

   if (err.error) console.log(err.error);

   // Finally send the Error
   res.status(err.errStatusCode).json({ statusMsg, message: err.message, stack });
};

class ServerError extends Error {
   constructor({ errStatusCode, errMassage, isOperational, error }) {
      super(errMassage);

      Object.setPrototypeOf(this, new.target.prototype);

      this.errStatusCode = errStatusCode;
      this.errMassage = errMassage;
      this.isOperational = isOperational;
      this.error = error;

      Error.captureStackTrace(this);
   }
}

module.exports = { ServerError, errorHandler };
