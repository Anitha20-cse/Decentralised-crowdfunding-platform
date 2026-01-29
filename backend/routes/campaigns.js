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
router.post('/', upload.any(), async (req, res) => {
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
      causeCategory,
      creatorAddress,
      numMilestones,
      milestones
    } = req.body;

    const images = req.files ? req.files.filter(file => file.fieldname === 'images').map(file => file.filename) : [];

    // Parse milestones JSON
    let parsedMilestones = [];
    console.log('Raw milestones from req.body:', milestones);
    if (milestones) {
      try {
        parsedMilestones = JSON.parse(milestones);
        console.log('Parsed milestones:', parsedMilestones);
        // Validate and format milestones
        parsedMilestones = parsedMilestones.map(m => ({
          title: m.title,
          description: m.description,
          amount: parseFloat(m.amount),
          expectedCompletionDate: new Date(m.expectedCompletionDate)
        }));
        console.log('Formatted milestones:', parsedMilestones);
        // Additional validation
        for (let m of parsedMilestones) {
          if (!m.title || !m.description || !m.amount || !m.expectedCompletionDate) {
            return res.status(400).json({ error: 'All milestone fields are required' });
          }
          if (isNaN(m.amount) || m.amount <= 0) {
            return res.status(400).json({ error: 'Milestone amount must be a positive number' });
          }
          if (isNaN(m.expectedCompletionDate.getTime())) {
            return res.status(400).json({ error: 'Invalid expected completion date' });
          }
        }
      } catch (error) {
        console.error('Error parsing milestones:', error);
        return res.status(400).json({ error: 'Invalid milestones format' });
      }
    }
    console.log('Final parsedMilestones:', parsedMilestones);

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
      images,
      creatorAddress,
      numMilestones: parseInt(numMilestones) || 0,
      milestones: parsedMilestones
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

// GET /campaigns/:id - Get a specific campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ campaignId: parseInt(req.params.id) });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

module.exports = router;
