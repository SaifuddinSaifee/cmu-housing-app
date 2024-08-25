const mongoose = require("mongoose");
const crypto = require("crypto");

const AdminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

AdminSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
};

AdminSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};

AdminSchema.pre("save", function (next) {
  if (this.isModified("password") && !this.salt) {
    this.setPassword(this.password);
  }
  next();
});

AdminSchema.methods.correctPassword = async function (candidatePassword) {
  console.log("User ID:", this._id);
  console.log("User Email:", this.email);
  console.log("Hashed Password in DB:", this.password);
  console.log("Plain text password provided:", candidatePassword);

  const isMatch = this.validPassword(candidatePassword);
  console.log("Password match:", isMatch);
  return isMatch;
};

module.exports = mongoose.model("Admin", AdminSchema);
