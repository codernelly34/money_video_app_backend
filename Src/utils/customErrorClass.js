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

module.exports = ServerError;
