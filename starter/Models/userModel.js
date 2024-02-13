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
      //Custom validators work on save won't work when be check when being updated
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
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

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  let changedTimeStamp = 0;
  if (this.passwordChangedAt) {
    changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(changedTimeStamp, JWTTimeStamp);
  }
  return JWTTimeStamp < changedTimeStamp;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
