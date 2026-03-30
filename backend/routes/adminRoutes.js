const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/auth.js');

// Apply security to all routes in this file
router.use(protect);
router.use(adminOnly);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (for the Admin Dashboard list)
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get deep nested details of a specific user/farmer
 */
router.get('/users/:id', adminController.getUserDetails);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user and farmer profile details
 */
router.put('/users/:id', adminController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user and all associated agricultural data
 */
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;