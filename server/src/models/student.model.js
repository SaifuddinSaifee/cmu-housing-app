const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema(
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
      required: [true, "Please provide a minimum 8 character password"],
      minlength: 8,
      select: false,
    },
    linkedinUrl: String,
    program: {
      type: String,
      required: [true, "Please provide your program name"],
    },
    homeCity: String,
    homeCountry: String,
    roomPreference: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
    },
    smokingPreference: {
      type: String,
      enum: ["noSmoke", "smoke", "noSmokeHouse"],
      default: "noSmoke",
    },
    alcoholPreference: {
      type: String,
      enum: ["noDrink", "drink", "noDrinkHouse"],
      default: "noDrink",
    },
    petPreference: {
      type: String,
      enum: ["noPet", "hasPet", "acceptsPet"],
      default: "noPet",
    },
    foodPreference: {
      type: String,
      enum: ["veg", "nonVeg", "vegHouse"],
      default: "nonVeg",
    },
    medicalCondition: String,
    otherRequirements: String,
    isNewStudent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
StudentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
