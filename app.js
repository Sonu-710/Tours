const morgan = require(`morgan`);
const express = require('express');
const appError = require('./starter/utils/AppError');
const globalErrorHandler = require('./starter/controller/errorController');
const toursRouter = require('./starter/router/tours');
const userRouter = require('./starter/router/users');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitze = require('express-mongo-sanitize');
const hpp = require('hpp');

const app = express();
//GLOBAL MIDDLEWARE
app.use(morgan('dev'));
//Add Headers to make it secure
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`./starter/public`));
// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

//Limit the max times access
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an Hour!!',
});
app.use('/api', limiter);

//Data Sanitization against NOSQL query injection
app.use(mongoSanitze());

//Data Sanitization against
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.time = new Date();
  next();
});

// app.get("/api/v1/tours", getAllTours());
// app.post("/api/v1/tours", createTour());

// app.get("/api/v1/tours/:id", getTour());
// app.patch("/api/v1/tours/:id", updateTour());
// app.delete("/api/v1/tours/:id", deleteTour());

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on the server`));
});

app.use(globalErrorHandler);
module.exports = app;
