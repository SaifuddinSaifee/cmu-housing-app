const Landlord = require("../models/landlord.model");
const jwt = require("jsonwebtoken");
const config = require("../config");

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

exports.signup = async (req, res) => {
  try {
    const newLandlord = await Landlord.create(req.body);
    const token = signToken(newLandlord._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        landlord: newLandlord,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const landlord = await Landlord.findOne({ email }).select("+password");

    if (
      !landlord ||
      !(await landlord.correctPassword(password, landlord.password))
    ) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    const token = signToken(landlord._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllLandlords = async (req, res) => {
  try {
    const landlords = await Landlord.find();

    res.status(200).json({
      status: "success",
      results: landlords.length,
      data: {
        landlords,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findById(req.params.id);

    if (!landlord) {
      return res.status(404).json({
        status: "fail",
        message: "No landlord found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        landlord,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!landlord) {
      return res.status(404).json({
        status: "fail",
        message: "No landlord found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        landlord,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndDelete(req.params.id);

    if (!landlord) {
      return res.status(404).json({
        status: "fail",
        message: "No landlord found with that ID",
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
