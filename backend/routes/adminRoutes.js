const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/auth.js');

router.use(protect);
router.use(adminOnly);

router.get('/users',        adminController.getAllUsers);
router.get('/users/:id',    adminController.getUserDetails);
router.put('/users/:id',    adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

//getting stats
router.get('/stats', adminController.getStats);

module.exports = router;