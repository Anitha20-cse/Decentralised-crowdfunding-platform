const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdfunding_fixed');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('campaigns');

    // Drop the index on campaignId
    await collection.dropIndex('campaignId_1');
    console.log('Dropped index campaignId_1');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error dropping index:', error);
  }
}

dropIndex();
