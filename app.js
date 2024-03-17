const morgan = require(`morgan`);
const express = require('express');
const app = express();
const appError = require('./starter/utils/AppError');
const globalErrorHandler = require('./starter/controller/errorController');
const toursRouter = require('./starter/router/tours');
const userRouter = require('./starter/router/users');
const rateLimit = require('express-rate-limit');

//GLOBAL MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`./starter/public`));
// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an Hour!!',
});

app.use('/api', limiter);
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
