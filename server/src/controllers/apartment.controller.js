const Apartment = require("../models/apartment.model");
const Student = require("../models/student.model");
const Landlord = require("../models/landlord.model");
const AppError = require("../utils/appError");

exports.getAllApartments = async (req, res, next) => {
  try {
    // 1) Build query
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Apartment.find(JSON.parse(queryStr));

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 4) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 5) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numApartments = await Apartment.countDocuments();
      if (skip >= numApartments)
        throw new AppError("This page does not exist", 404);
    }

    // 6) Populate landlord name
    query = query.populate("landlord", "name");

    // Execute query
    const apartments = await query;

    // 7) Send response
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
    const apartment = await Apartment.findById(req.params.id).populate(
      "landlord",
      "name email phone"
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

exports.createApartment = async (req, res, next) => {
  try {
    // Handle file uploads
    if (req.files) {
      req.body.images = req.files.map((file) => file.path);
    }

    // Set the landlord to the current user
    req.body.landlord = req.user.id;

    // Get landlord name
    const landlord = await Landlord.findById(req.user.id);
    req.body.landlordName = landlord.name;

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

exports.updateApartment = async (req, res, next) => {
  try {
    // Handle file uploads
    if (req.files) {
      req.body.images = req.files.map((file) => file.path);
    }

    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return next(new AppError("No apartment found with that ID", 404));
    }

    // Check if the current user is the landlord of this apartment
    if (apartment.landlord.toString() !== req.user.id) {
      return next(
        new AppError("You do not have permission to update this apartment", 403)
      );
    }

    const updatedApartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        apartment: updatedApartment,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteApartment = async (req, res, next) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return next(new AppError("No apartment found with that ID", 404));
    }

    // Check if the current user is the landlord of this apartment
    if (apartment.landlord.toString() !== req.user.id) {
      return next(
        new AppError("You do not have permission to delete this apartment", 403)
      );
    }

    await Apartment.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.saveApartment = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return next(new AppError("No apartment found with that ID", 404));
    }

    if (student.savedListings.includes(apartment._id)) {
      return next(new AppError("Apartment already saved", 400));
    }

    student.savedListings.push(apartment._id);
    await student.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Apartment saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.unsaveApartment = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return next(new AppError("No apartment found with that ID", 404));
    }

    student.savedListings = student.savedListings.filter(
      (id) => id.toString() !== apartment._id.toString()
    );
    await student.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Apartment removed from saved listings",
    });
  } catch (err) {
    next(err);
  }
};
