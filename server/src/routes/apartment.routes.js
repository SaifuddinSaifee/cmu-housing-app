const express = require("express");
const apartmentController = require("../controllers/apartment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/apartments:
 *   get:
 *     summary: Get all apartments
 *     tags: [Apartments]
 *     responses:
 *       200:
 *         description: List of all apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Apartment'
 */
router.get("/", apartmentController.getAllApartments);

/**
 * @swagger
 * /api/apartments/{id}:
 *   get:
 *     summary: Get an apartment by ID
 *     tags: [Apartments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apartment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       404:
 *         description: Apartment not found
 */
router.get("/:id", apartmentController.getApartment);

// Protected routes
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/apartments/save/{id}:
 *   post:
 *     summary: Save an apartment (for students)
 *     tags: [Apartments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apartment saved successfully
 *       404:
 *         description: Apartment not found
 */
router.post("/save/:id", apartmentController.saveApartment);

/**
 * @swagger
 * /api/apartments/unsave/{id}:
 *   delete:
 *     summary: Unsave an apartment (for students)
 *     tags: [Apartments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apartment unsaved successfully
 *       404:
 *         description: Apartment not found
 */
router.delete("/unsave/:id", apartmentController.unsaveApartment);

// Landlord-specific routes
router.use(authMiddleware.restrictTo("landlord"));

/**
 * @swagger
 * /api/apartments:
 *   post:
 *     summary: Create a new apartment (for landlords)
 *     tags: [Apartments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               rent:
 *                 type: number
 *               deposit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Apartment created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/",
  upload.array("images", 5),
  apartmentController.createApartment
);

/**
 * @swagger
 * /api/apartments/{id}:
 *   patch:
 *     summary: Update an apartment (for landlords)
 *     tags: [Apartments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               rent:
 *                 type: number
 *               deposit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Apartment updated successfully
 *       404:
 *         description: Apartment not found
 */
router.patch(
  "/:id",
  upload.array("images", 5),
  apartmentController.updateApartment
);

/**
 * @swagger
 * /api/apartments/{id}:
 *   delete:
 *     summary: Delete an apartment (for landlords)
 *     tags: [Apartments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Apartment deleted successfully
 *       404:
 *         description: Apartment not found
 */
router.delete("/:id", apartmentController.deleteApartment);

module.exports = router;
