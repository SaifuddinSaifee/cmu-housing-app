const Landlord = require("../models/landlord.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

exports.signup = async (req, res, next) => {
  try {
    // Check if password is provided
    if (!req.body.password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password is required'
      });
    }

    const newLandlord = new Landlord({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      preferredContactMethod: req.body.preferredContactMethod,
    });

    // Set password using the new method
    newLandlord.setPassword(req.body.password);

    const savedLandlord = await newLandlord.save();
    const token = signToken(savedLandlord._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        landlord: {
          id: savedLandlord._id,
          name: savedLandlord.name,
          email: savedLandlord.email,
          phone: savedLandlord.phone,
          preferredContactMethod: savedLandlord.preferredContactMethod,
        },
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("Login attempt for:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password"
      });
    }

    const landlord = await Landlord.findOne({ email }).select("+password +salt");
    console.log("Landlord found:", !!landlord);

    if (!landlord || !landlord.validPassword(password)) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password"
      });
    }

    const token = signToken(landlord._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        landlord: {
          id: landlord._id,
          name: landlord.name,
          email: landlord.email,
          phone: landlord.phone,
          preferredContactMethod: landlord.preferredContactMethod,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred during login"
    });
  }
};

exports.getAllLandlords = async (req, res, next) => {
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
    next(err);
  }
};

exports.getLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.findById(req.params.id);

    if (!landlord) {
      return next(new AppError("No landlord found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        landlord,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.findById(req.params.id);

    if (!landlord) {
      return next(new AppError("No landlord found with that ID", 404));
    }

    // Update fields
    landlord.name = req.body.name || landlord.name;
    landlord.email = req.body.email || landlord.email;
    landlord.phone = req.body.phone || landlord.phone;
    landlord.preferredContactMethod =
      req.body.preferredContactMethod || landlord.preferredContactMethod;

    if (req.body.password) {
      landlord.setPassword(req.body.password);
    }

    const updatedLandlord = await landlord.save();

    res.status(200).json({
      status: "success",
      data: {
        landlord: {
          id: updatedLandlord._id,
          name: updatedLandlord.name,
          email: updatedLandlord.email,
          phone: updatedLandlord.phone,
          preferredContactMethod: updatedLandlord.preferredContactMethod,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.findByIdAndDelete(req.params.id);

    if (!landlord) {
      return next(new AppError("No landlord found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
