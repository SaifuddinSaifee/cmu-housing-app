const Apartment = require("../models/apartment.model");

exports.createApartment = async (req, res) => {
  try {
    const newApartment = await Apartment.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        apartment: newApartment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();

    res.status(200).json({
      status: "success",
      results: apartments.length,
      data: {
        apartments,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({
        status: "fail",
        message: "No apartment found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        apartment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!apartment) {
      return res.status(404).json({
        status: "fail",
        message: "No apartment found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        apartment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);

    if (!apartment) {
      return res.status(404).json({
        status: "fail",
        message: "No apartment found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
