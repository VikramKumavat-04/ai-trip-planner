const { v4: uuidv4 } = require('uuid');
const Trip = require('../models/Trip.model');
const User = require('../models/User.model');
const { generateTripItinerary } = require('../services/gemini.service');

// @POST /api/trips/generate
const generateTrip = async (req, res, next) => {
  try {
    const tripData = req.body;
    tripData.userId = req.user._id;

    const itinerary = await generateTripItinerary(tripData);

    res.json({
      success: true,
      message: 'Itinerary generated successfully',
      data: { itinerary },
    });
  } catch (err) {
    console.error('Generate trip error:', err.message);
    // if (err.message?.includes('API key') || err.message?.includes('quota') || err.message?.includes('403') || err.message?.includes('Forbidden')) {
    //   return res.status(503).json({ success: false, message: 'AI service temporarily unavailable. Please try again.' });
    // }
    if (err.message?.includes('parse') || err.message?.includes('JSON')) {
      return res.status(500).json({ success: false, message: 'AI returned invalid response. Please try again.' });
    }
    next(err);
  }
};

// @POST /api/trips - Save a trip
const createTrip = async (req, res, next) => {
  try {
    const { title, country, city, budget, duration, travelers, travelStyle, startDate, endDate, interests, generatedItinerary, notes } = req.body;

    const trip = await Trip.create({
      title: title || `${city}, ${country} - ${duration} Days`,
      country, city, budget, duration, travelers, travelStyle,
      startDate, endDate, interests, generatedItinerary, notes,
      status: 'saved',
      createdBy: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { createdTrips: trip._id } });

    res.status(201).json({ success: true, message: 'Trip saved successfully', data: { trip } });
  } catch (err) { next(err); }
};

// @GET /api/trips - Get all user trips
const getTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = { createdBy: req.user._id };
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const total = await Trip.countDocuments(query);
    const trips = await Trip.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-generatedItinerary.dailyPlan -generatedItinerary.packingList');

    res.json({
      success: true,
      data: {
        trips,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
      },
    });
  } catch (err) { next(err); }
};

// @GET /api/trips/:id
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('createdBy', 'name avatar email');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const isOwner = trip.createdBy._id.toString() === req.user?._id.toString();
    if (!trip.isPublic && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { trip } });
  } catch (err) { next(err); }
};

// @GET /api/trips/share/:token
const getTripByShareToken = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isPublic: true })
      .populate('createdBy', 'name avatar');
    if (!trip) return res.status(404).json({ success: false, message: 'Shared trip not found' });
    res.json({ success: true, data: { trip } });
  } catch (err) { next(err); }
};

// @PUT /api/trips/:id
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedUpdates = ['title', 'notes', 'checklist', 'isPublic', 'status', 'generatedItinerary'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) trip[field] = req.body[field];
    });
    await trip.save();

    res.json({ success: true, message: 'Trip updated', data: { trip } });
  } catch (err) { next(err); }
};

// @DELETE /api/trips/:id
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await trip.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { createdTrips: trip._id } });

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (err) { next(err); }
};

// @POST /api/trips/:id/share
const shareTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!trip.shareToken) trip.shareToken = uuidv4();
    trip.isPublic = true;
    await trip.save();

    const shareUrl = `${process.env.CLIENT_URL}/trip/shared/${trip.shareToken}`;
    res.json({ success: true, data: { shareToken: trip.shareToken, shareUrl } });
  } catch (err) { next(err); }
};

// @GET /api/trips/stats
const getTripStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [totalTrips, countries, recent] = await Promise.all([
      Trip.countDocuments({ createdBy: userId }),
      Trip.distinct('country', { createdBy: userId }),
      Trip.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(3).select('title city country createdAt'),
    ]);

    res.json({
      success: true,
      data: { totalTrips, countriesVisited: countries.length, recentTrips: recent },
    });
  } catch (err) { next(err); }
};

module.exports = { generateTrip, createTrip, getTrips, getTripById, getTripByShareToken, updateTrip, deleteTrip, shareTrip, getTripStats };
