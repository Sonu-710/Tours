// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

const Tour = require('./../Models/tourModel');

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failure',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new :true,
      runValidators:true
    })
    res.status(200).json({
      status: 'success',
      updatedTour
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour=await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data:null
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};
