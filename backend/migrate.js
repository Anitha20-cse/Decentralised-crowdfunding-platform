const mongoose = require('mongoose');
require('dotenv').config();

const Campaign = require('./models/Campaign');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdfunding_fixed');
    console.log('Connected to MongoDB');

    const campaigns = await Campaign.find().sort({ createdAt: 1 });
    for (let i = 0; i < campaigns.length; i++) {
      campaigns[i].campaignId = i;
      await campaigns[i].save();
      console.log(`Updated campaign ${i}`);
    }

    console.log('Migration completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error migrating:', error);
  }
}

migrate();
