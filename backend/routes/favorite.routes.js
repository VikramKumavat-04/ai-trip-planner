const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:destination', protect, removeFavorite);

module.exports = router;
