const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const LandlordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      validate: {
        validator: function (v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },
    properties: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Apartment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
LandlordSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
LandlordSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Landlord = mongoose.model("Landlord", LandlordSchema);

module.exports = Landlord;
