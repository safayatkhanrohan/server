const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
cors = require('cors')
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');

const products = require('./routes/products');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const paymentRouter = require('./routes/paymentRouter');

const connectDB = require('./config/dbConfig');
const errorMiddleware = require('./middlewares/errors');

connectDB();

//middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// routes
app.use('/api/v1', products);
app.use('/api/v1', userRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', paymentRouter);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;