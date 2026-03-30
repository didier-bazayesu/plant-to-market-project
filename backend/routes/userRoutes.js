const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const { registerUserValidation, loginUserValidation } = require('../validators/userValidator');

// ✅ Public routes
router.post('/register', registerUserValidation, validate, userController.register);
router.post('/login', loginUserValidation, validate, userController.login);

// ✅ Protected routes
router.get('/me', protect, userController.me);

module.exports = router;