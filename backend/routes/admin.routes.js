const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, getAllTrips, deleteTrip } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/trips', getAllTrips);
router.delete('/trips/:id', deleteTrip);

module.exports = router;
