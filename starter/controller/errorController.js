const AppError = require('./../utils/AppError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code == '11000') error = handleDublicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, res);
  }
};

const handleJsonWebTokenError = () =>
  new AppError('Invalid Token Please login agian', 401);

const handleTokenExpiredError = () =>
  new AppError('Token expired Error.Login in Again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error('ERROR :', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const message = `Dublicate name ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
