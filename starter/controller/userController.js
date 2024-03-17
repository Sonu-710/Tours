const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: users.length,
    users,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route is yet to be defined!!!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route is yet to be defined!!!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route is yet to be defined!!!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route is yet to be defined!!!',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 --> Create error if user Posts Password data
  if (req.body.password || req.body.confrim_password) {
    return next(
      new AppError(
        'This route is not for password updates.Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2--> Filter the fields allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3--> Upadte user Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
