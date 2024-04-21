const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./Src/middlewares/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Disable 'x-powered-by' for security reason
app.disable('x-powered-by');

// Middlewares
app.use(cors({ origin: ['http://127.0.0.1:5173', 'http://localhost:5173'], credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', require('./Src/routers/router'));

// Error Handler
app.use(errorHandler);

// Handle unknown Routes
app.all('*', (req, res) => {
   res.status(404).json('404 not fund 😢');
});

// MongoDB connection and starting server
mongoose
   .connect(process.env.MONGO_URI)
   .then((result) => {
      if (result) app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
   })
   .catch((error) => console.log(error));
