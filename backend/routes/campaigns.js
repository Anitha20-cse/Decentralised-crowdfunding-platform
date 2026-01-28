const express = require('express');
const multer = require('multer');
const path = require('path');
const Campaign = require('../models/Campaign');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /campaigns - Create a new campaign
router.post('/', upload.array('images'), async (req, res) => {
  try {
    console.log('Received req.body:', req.body);
    console.log('Received req.files:', req.files);

    const {
      title,
      shortDescription,
      detailedDescription,
      goalAmount,
      durationInDays,
      creatorName,
      creatorRole,
      causeCategory
    } = req.body;

    const images = req.files ? req.files.map(file => file.filename) : [];

    console.log('Parsed data:', {
      title,
      shortDescription,
      detailedDescription,
      goalAmount: parseFloat(goalAmount),
      durationInDays: parseInt(durationInDays),
      creatorName,
      creatorRole,
      causeCategory,
      images
    });

    // Get the next campaignId
    const count = await Campaign.countDocuments();
    const campaignId = count;

    const campaign = new Campaign({
      campaignId,
      title,
      shortDescription,
      detailedDescription,
      goalAmount: parseFloat(goalAmount),
      durationInDays: parseInt(durationInDays),
      creatorName,
      creatorRole,
      causeCategory,
      images
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign', details: error.message });
  }
});

// GET /campaigns - Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

module.exports = router;
