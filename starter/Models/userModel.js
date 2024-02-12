const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
  },
  email: {
    type: String,
    required: [true, 'A user must enter the Email'],
    unique: true,
    validate: [validator.isEmail, 'Plaese provide a email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true],
    minlength: 8,
  },
  confirm_password: {
    type: String,
    required: [true],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
