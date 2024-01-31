
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

const tourModel=require('./../Models/tourModel')



exports.createTour = async (req, res) => {

  console.log(req.body);
  res.status(201).json({
    status: 'success',
    requested_Time: req.time.toISOString(),
  });
};

exports.getAllTours = (req, res) => {
  
};

exports.getTour = (req, res) => {
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: '<updated data......>',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
