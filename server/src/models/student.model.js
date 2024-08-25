const mongoose = require("mongoose");
const crypto = require("crypto");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@andrew\.cmu\.edu$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Andrew email!`,
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
    linkedinUrl: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please specify your gender"],
    },
    programName: {
      type: String,
      required: [true, "Please provide your program name"],
    },
    homeCity: String,
    homeCountry: String,
    roomPreference: {
      type: String,
      enum: ["private", "shared"],
      required: [true, "Please specify your room preference"],
    },
    smokingPreference: {
      type: String,
      enum: ["noSmoke", "smoke", "noSmokeHouse"],
      required: [true, "Please specify your smoking preference"],
    },
    alcoholPreference: {
      type: String,
      enum: ["noDrink", "drink", "noDrinkHouse"],
      required: [true, "Please specify your alcohol preference"],
    },
    petPreference: {
      type: String,
      enum: ["noPet", "hasPet", "acceptsPet"],
      required: [true, "Please specify your pet preference"],
    },
    foodPreference: {
      type: String,
      enum: ["veg", "nonVeg", "vegHouse"],
      required: [true, "Please specify your food preference"],
    },
    medicalCondition: String,
    otherRequirements: String,
    isNewStudent: {
      type: Boolean,
      default: true,
    },
    savedListings: [
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

StudentSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
};

StudentSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};

StudentSchema.pre("save", function (next) {
  if (this.isModified("password") && !this.salt) {
    this.setPassword(this.password);
  }
  next();
});

StudentSchema.methods.correctPassword = async function (candidatePassword) {
  console.log("User ID:", this._id);
  console.log("User Email:", this.email);
  console.log("Hashed Password in DB:", this.password);
  console.log("Plain text password provided:", candidatePassword);

  const isMatch = this.validPassword(candidatePassword);
  console.log("Password match:", isMatch);
  return isMatch;
};

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
