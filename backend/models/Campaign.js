const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: Number,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  creatorRole: {
    type: String,
    required: true,
  },
  causeCategory: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  images: [{
    type: String, // IPFS links
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Campaign', campaignSchema);
