const express = require('express');
const studentController = require('../controllers/student.controller');

const router = express.Router();

router.post('/signup', studentController.signup);
router.post('/login', studentController.login);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudent);
router.patch('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;