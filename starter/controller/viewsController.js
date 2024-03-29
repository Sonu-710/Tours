const Tour = require('../Models/tourModel.js');
const catchAsync = require('../utils/catchAsync.js');
const { getTourStats } = require('./tourController.js');
exports.getOverview = catchAsync(async (req, res) => {
  //1--> Get Tour data
  const tours = await Tour.find();
  //2-->Build Template

  //3-->Render that template using tour data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com",
    )
    .render('overview', {
      title: 'All Tours',
      tours,
    });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com",
    )
    .render('tours', {
      title: `${tour.name} tour`,
      tour,
    });
});

exports.getLoginFrom = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com",
    )
    .render('login', {
      title: 'Log intom your Account',
    });
};
