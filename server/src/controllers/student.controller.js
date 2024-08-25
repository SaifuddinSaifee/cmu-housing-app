const Student = require('../models/student.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
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

    const newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      programName: req.body.programName,
      roomPreference: req.body.roomPreference,
      smokingPreference: req.body.smokingPreference,
      alcoholPreference: req.body.alcoholPreference,
      petPreference: req.body.petPreference,
      foodPreference: req.body.foodPreference
    });

    // Set password using the new method
    newStudent.setPassword(req.body.password);

    await newStudent.save();

    const token = signToken(newStudent._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        student: {
          id: newStudent._id,
          email: newStudent.email,
          name: newStudent.name
        }
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if student exists & password is correct
    const student = await Student.findOne({ email }).select('+password +salt');

    if (!student || !student.validPassword(password)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // If everything ok, send token to client
    const token = signToken(student._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        student: {
          id: student._id,
          email: student.email,
          name: student.name
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        student
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'password') {
        student[key] = req.body[key];
      }
    });

    // If password is being updated
    if (req.body.password) {
      student.setPassword(req.body.password);
    }

    const updatedStudent = await student.save();

    res.status(200).json({
      status: 'success',
      data: {
        student: updatedStudent
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};