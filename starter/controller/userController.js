const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async(req, res) => {
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
