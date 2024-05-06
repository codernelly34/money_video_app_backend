const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./Src/routers/router');
const errorHandler = require('./Src/middlewares/errorHandler');
require('dotenv/config');

const app = express();
const PORT = process.env.PORT || 3000;

// Disable 'x-powered-by' for security reason
app.disable('x-powered-by');

// Middlewares
app.use(cors({ origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], credentials: true })); // origin: ['http://127.0.0.1:3000', 'http://localhost:3000']
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Handle unknown Routes
app.all('*', (_req, res) => {
   res.status(404).json('404 not fund 😢');
});

// Error Handler
app.use(errorHandler);

// MongoDB connection
mongoose
   .connect(process.env.MONGO_URI)
   .then(() => {
      console.log('MongoDB connected successfully!');
      // Start the server after MongoDB connection is established
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
   })
   .catch((error) => {
      mongoose.connection.close();
      console.error(error);
      process.exit(1);
   });
