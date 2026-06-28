const User = require('../models/User.model');

const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');
    res.json({ success: true, data: { favorites: user.favorites || [] } });
  } catch (err) { next(err); }
};

const addFavorite = async (req, res, next) => {
  try {
    const { destination } = req.body;
    if (!destination) return res.status(400).json({ success: false, message: 'Destination required' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: destination } },
      { new: true }
    );
    res.json({ success: true, message: 'Added to favorites', data: { favorites: user.favorites } });
  } catch (err) { next(err); }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { destination } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: decodeURIComponent(destination) } },
      { new: true }
    );
    res.json({ success: true, message: 'Removed from favorites', data: { favorites: user.favorites } });
  } catch (err) { next(err); }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
