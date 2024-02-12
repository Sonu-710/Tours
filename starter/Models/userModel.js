const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    select: false,
  },
  confirm_password: {
    type: String,
    required: [true],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
