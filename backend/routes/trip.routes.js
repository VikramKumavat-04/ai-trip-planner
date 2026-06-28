const express = require('express');
const router = express.Router();
const { generateTrip, createTrip, getTrips, getTripById, getTripByShareToken, updateTrip, deleteTrip, shareTrip, getTripStats } = require('../controllers/trip.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { generateTripValidator } = require('../validators/trip.validators');
const { validate } = require('../middleware/validate.middleware');
const rateLimit = require('express-rate-limit');

const generateLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { success: false, message: 'Generation limit reached (20/hour)' } });

router.post('/generate', protect, generateLimiter, generateTripValidator, validate, generateTrip);
router.get('/stats', protect, getTripStats);
router.get('/shared/:token', getTripByShareToken);
router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.get('/:id', optionalAuth, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.post('/:id/share', protect, shareTrip);

module.exports = router;
