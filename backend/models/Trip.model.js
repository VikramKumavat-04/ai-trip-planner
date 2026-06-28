const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  budget: { type: String, enum: ['budget','moderate','luxury'], required: true },
  duration: { type: Number, required: true, min: 1, max: 30 },
  travelers: { type: Number, required: true, min: 1, max: 20 },
  travelStyle: { type: String, enum: ['adventure','family','solo','romantic','business','luxury','backpacker'], default: 'adventure' },
  startDate: { type: Date },
  endDate: { type: Date },
  interests: [{ type: String }],

  // AI Generated Content - Mixed type to accept any JSON structure from Gemini
  generatedItinerary: { type: mongoose.Schema.Types.Mixed },

  images: [{ url: String, caption: String, credit: String }],
  shareToken: { type: String, sparse: true },
  isPublic: { type: Boolean, default: false },
  status: { type: String, enum: ['draft','generated','saved'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checklist: [{ item: String, completed: { type: Boolean, default: false } }],
  notes: String,
}, { timestamps: true });

tripSchema.index({ createdBy: 1, createdAt: -1 });
tripSchema.index({ shareToken: 1 });
tripSchema.index({ city: 'text', country: 'text', title: 'text' });

module.exports = mongoose.model('Trip', tripSchema);