const express = require("express");
const landlordController = require("../controllers/landlord.controller");

const router = express.Router();

router.post("/signup", landlordController.signup);
router.post("/login", landlordController.login);
router.get("/", landlordController.getAllLandlords);
router.get("/:id", landlordController.getLandlord);
router.patch("/:id", landlordController.updateLandlord);
router.delete("/:id", landlordController.deleteLandlord);

module.exports = router;
