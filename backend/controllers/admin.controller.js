const User = require('../models/User.model');
const Trip = require('../models/Trip.model');

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, recentUsers, recentTrips] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt role'),
      Trip.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email').select('title city country createdAt'),
    ]);
    res.json({ success: true, data: { totalUsers, totalTrips, recentUsers, recentTrips } });
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit));
    res.json({ success: true, data: { users, total } });
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

const getAllTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Trip.countDocuments();
    const trips = await Trip.find().sort({ createdAt: -1 }).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).populate('createdBy', 'name email');
    res.json({ success: true, data: { trips, total } });
  } catch (err) { next(err); }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip deleted by admin' });
  } catch (err) { next(err); }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser, getAllTrips, deleteTrip };
