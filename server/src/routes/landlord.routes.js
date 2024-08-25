const express = require("express");
const landlordController = require("../controllers/landlord.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/landlords/signup:
 *   post:
 *     summary: Register a new landlord
 *     tags: [Landlords]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               preferredContactMethod:
 *                 type: string
 *                 enum: [email, phone]
 *     responses:
 *       201:
 *         description: Landlord registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/signup", landlordController.signup);

/**
 * @swagger
 * /api/landlords/login:
 *   post:
 *     summary: Landlord login
 *     tags: [Landlords]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/login", landlordController.login);

// Protect all routes after this middleware
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/landlords:
 *   get:
 *     summary: Get all landlords
 *     tags: [Landlords]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all landlords
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Landlord'
 */
router.get("/", landlordController.getAllLandlords);

/**
 * @swagger
 * /api/landlords/{id}:
 *   get:
 *     summary: Get a landlord by ID
 *     tags: [Landlords]
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
 *         description: Landlord details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       404:
 *         description: Landlord not found
 *   patch:
 *     summary: Update a landlord
 *     tags: [Landlords]
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Landlord'
 *     responses:
 *       200:
 *         description: Landlord updated successfully
 *       404:
 *         description: Landlord not found
 *   delete:
 *     summary: Delete a landlord
 *     tags: [Landlords]
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
 *         description: Landlord deleted successfully
 *       404:
 *         description: Landlord not found
 */
router.get("/:id", landlordController.getLandlord);
router.patch("/:id", landlordController.updateLandlord);
router.delete("/:id", landlordController.deleteLandlord);

module.exports = router;
