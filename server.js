const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./Src/middlewares/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: ['http://127.0.0.1:5173', 'http://localhost:5173'], credentials: true })); //{ origin: "http://127.0.0.1:5173", credentials: true }
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', require('./Src/routers/router'));

app.get('/', (req, res, next) => {
   // res.status(200).send(
   //    "<video src='http://localhost:4040/api/v1/videoStream/73f72503-3372-4c8f-876b-32f3b23e34b3.mp4' controls></video>"
   // );
});

// Unknown Routes
app.all('*', (req, res) => {
   res.status(404).json('404 not fund');
});

// Error Handler
app.use(errorHandler);

// MongoDB connection and starting server
mongoose
   .connect(process.env.MONGO_URI)
   .then((result) => {
      if (result) app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
   })
   .catch((error) => console.log(error));

// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
