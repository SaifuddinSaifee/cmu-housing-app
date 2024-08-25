const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    // Use a combination of field name, timestamp, and original extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Configure multer for file uploads
const upload = multer({
  storage: storage,
  // Filter files based on their mime type
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      // Reject non-image files
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
});

// Export the configured multer middleware
module.exports = upload;
