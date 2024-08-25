const mongoose = require("mongoose");
const crypto = require("crypto");

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
    salt: {
      type: String,
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

LandlordSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
};

LandlordSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};

LandlordSchema.pre("save", function (next) {
  if (this.isModified("password") && !this.salt) {
    this.setPassword(this.password);
  }
  next();
});

LandlordSchema.methods.correctPassword = async function (candidatePassword) {
  console.log("User ID:", this._id);
  console.log("User Email:", this.email);
  console.log("Hashed Password in DB:", this.password);
  console.log("Plain text password provided:", candidatePassword);

  const isMatch = this.validPassword(candidatePassword);
  console.log("Password match:", isMatch);
  return isMatch;
};

const Landlord = mongoose.model("Landlord", LandlordSchema);

module.exports = Landlord;
