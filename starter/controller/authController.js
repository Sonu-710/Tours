const { promisify } = require('util');
const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const { crossOriginResourcePolicy } = require('helmet');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createUserToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(
    req.body,
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // confirm_password: req.body.confirm_password,
  );
  createUserToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or Password', 401));
  }
  console.log(user);
  createUserToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1 -- > Getting token and checking of its's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //   console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in, login to get access', 401),
    );
  }

  //2--> Verification of the Token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //3--> Check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The User belonging to the token does not exist', 401),
    );

  //4--> Check if user changed password
  if (currentUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError('User Recently Changed Password! Please Login Again ', 401),
    );

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perfrom this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 --> Get User based on the Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2 --> If the token has not expired and there is user, set the new Password

  if (!user) {
    return next(new AppError('Token is inValid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 3 --> Update changedPassword property

  // 4 --> Log the user in, send JWT
  createUserToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1 --> Get the user from the collection
  const user = await User.findById(req.user.id).select('+password');

  //2 --> Check if the posted current password is correct

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return new AppError('Incorrect Password', 401);
  }

  // //3 --> If so,update the Password

  user.password = req.body.newPassword;
  user.confirm_password = req.body.confirm_password;
  await user.save();

  // //4 --> Log user in, send JWT
  createUserToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      console.log(req.cookies.jwt);
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      console.log(decoded);

      // Check if the user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // Check if user changed password
      if (currentUser.changePasswordAfter(decoded.iat)) return next();

      res.locals.user = currentUser;
    }
  } catch (err) {
    return next();
  }
  next();
};
