const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
router.post("/login", adminController.login);

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("admin"));

// Landlord routes
/**
 * @swagger
 * /api/admin/landlords:
 *   post:
 *     summary: Create a new landlord (Admin only)
 *     tags: [Admin, Landlords]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Landlord'
 *     responses:
 *       201:
 *         description: Landlord created successfully
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all landlords (Admin only)
 *     tags: [Admin, Landlords]
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
router.post("/landlords", adminController.createLandlord);
router.get("/landlords", adminController.getAllLandlords);

/**
 * @swagger
 * /api/admin/landlords/{id}:
 *   get:
 *     summary: Get a landlord by ID (Admin only)
 *     tags: [Admin, Landlords]
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
 *     summary: Update a landlord (Admin only)
 *     tags: [Admin, Landlords]
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
 *     summary: Delete a landlord (Admin only)
 *     tags: [Admin, Landlords]
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
router.get("/landlords/:id", adminController.getLandlord);
router.patch("/landlords/:id", adminController.updateLandlord);
router.delete("/landlords/:id", adminController.deleteLandlord);

// Student routes
/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students (Admin only)
 *     tags: [Admin, Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get("/students", adminController.getAllStudents);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   get:
 *     summary: Get a student by ID (Admin only)
 *     tags: [Admin, Students]
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
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *   patch:
 *     summary: Update a student (Admin only)
 *     tags: [Admin, Students]
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
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *   delete:
 *     summary: Delete a student (Admin only)
 *     tags: [Admin, Students]
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
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.get("/students/:id", adminController.getStudent);
router.patch("/students/:id", adminController.updateStudent);
router.delete("/students/:id", adminController.deleteStudent);

// Apartment routes
/**
 * @swagger
 * /api/admin/apartments:
 *   post:
 *     summary: Create a new apartment (Admin only)
 *     tags: [Admin, Apartments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Apartment'
 *     responses:
 *       201:
 *         description: Apartment created successfully
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all apartments (Admin only)
 *     tags: [Admin, Apartments]
 *     security:
 *       - bearerAuth: []
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
router.post("/apartments", adminController.createApartment);
router.get("/apartments", adminController.getAllApartments);

/**
 * @swagger
 * /api/admin/apartments/{id}:
 *   get:
 *     summary: Get an apartment by ID (Admin only)
 *     tags: [Admin, Apartments]
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
 *         description: Apartment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       404:
 *         description: Apartment not found
 *   patch:
 *     summary: Update an apartment (Admin only)
 *     tags: [Admin, Apartments]
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
 *             $ref: '#/components/schemas/Apartment'
 *     responses:
 *       200:
 *         description: Apartment updated successfully
 *       404:
 *         description: Apartment not found
 *   delete:
 *     summary: Delete an apartment (Admin only)
 *     tags: [Admin, Apartments]
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
router.get("/apartments/:id", adminController.getApartment);
router.patch("/apartments/:id", adminController.updateApartment);
router.delete("/apartments/:id", adminController.deleteApartment);

module.exports = router;
