const Admin = require("../models/admin.model");
const Landlord = require("../models/landlord.model");
const Student = require("../models/student.model");
const Apartment = require("../models/apartment.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // 2) Check if admin exists && password is correct
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(admin._id);

    // Remove password from output
    admin.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        admin,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Landlord CRUD operations
exports.createLandlord = async (req, res, next) => {
  try {
    const newLandlord = await Landlord.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        landlord: newLandlord,
      },
    });
  } catch (err) {
    next(err);
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
    const landlord = await Landlord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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

// Student CRUD operations
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      status: "success",
      results: students.length,
      data: {
        students,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new AppError("No student found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return next(new AppError("No student found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return next(new AppError("No student found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Apartment CRUD operations
exports.createApartment = async (req, res, next) => {
  try {
    const newApartment = await Apartment.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        apartment: newApartment,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllApartments = async (req, res, next) => {
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
    next(err);
  }
};

exports.getApartment = async (req, res, next) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return next(new AppError("No apartment found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        apartment,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateApartment = async (req, res, next) => {
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
      return next(new AppError("No apartment found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        apartment,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteApartment = async (req, res, next) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) {
      return next(new AppError("No apartment found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
