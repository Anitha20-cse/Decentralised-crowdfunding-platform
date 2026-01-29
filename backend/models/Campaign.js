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
  creatorAddress: {
    type: String,
  },
  numMilestones: {
    type: Number,
    default: 0,
  },
  milestones: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true }, // Target amount for this milestone
    expectedCompletionDate: { type: Date, required: true },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Campaign', campaignSchema);
