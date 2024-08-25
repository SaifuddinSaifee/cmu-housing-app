const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.ObjectId,
      ref: "Landlord",
      required: [true, "Apartment must belong to a landlord"],
    },
    landlordName: {
      type: String,
      required: [true, "Landlord name is required"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Please provide the street address"],
      },
      city: {
        type: String,
        required: [true, "Please provide the city"],
      },
      state: {
        type: String,
        required: [true, "Please provide the state"],
      },
      zipCode: {
        type: String,
        required: [true, "Please provide the ZIP code"],
      },
    },
    rent: {
      type: Number,
      required: [true, "Please provide the rent amount"],
    },
    deposit: {
      type: Number,
      required: [true, "Please provide the deposit amount"],
    },
    availableFrom: {
      type: Date,
      required: [
        true,
        "Please provide the date when the apartment is available from",
      ],
    },
    roomType: {
      type: String,
      enum: ["private", "shared"],
      required: [true, "Please specify if the room is private or shared"],
    },
    numberOfRooms: {
      type: Number,
      required: [true, "Please provide the number of rooms"],
    },
    numberOfBathrooms: {
      type: Number,
      required: [true, "Please provide the number of bathrooms"],
    },
    squareFootage: Number,
    amenities: [String],
    petsAllowed: {
      type: Boolean,
      default: false,
    },
    smokingAllowed: {
      type: Boolean,
      default: false,
    },
    parkingAvailable: {
      type: Boolean,
      default: false,
    },
    images: [String],
    description: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    requiredDocuments: [String],
    termsAndConditions: {
      type: String,
      required: [true, "Please provide the terms and conditions"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
ApartmentSchema.index({ rent: 1, roomType: 1, isAvailable: 1 });

const Apartment = mongoose.model("Apartment", ApartmentSchema);

module.exports = Apartment;
