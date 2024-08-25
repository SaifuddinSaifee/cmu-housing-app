const express = require("express");
const apartmentController = require("../controllers/apartment.controller");

const router = express.Router();

router.post("/", apartmentController.createApartment);
router.get("/", apartmentController.getAllApartments);
router.get("/:id", apartmentController.getApartment);
router.patch("/:id", apartmentController.updateApartment);
router.delete("/:id", apartmentController.deleteApartment);

module.exports = router;
