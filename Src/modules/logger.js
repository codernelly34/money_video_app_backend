require('dotenv/config');

const myLogger = (error) => {
   if (process.env.NODE_ENV !== 'production') console.log(error);
};

module.exports = myLogger;
