# TODO for Crowdfunding Project Enhancements

## Smart Contract Modifications
- [ ] Modify blockchain/contracts/Crowdfunding.sol to add new fields to Campaign and Milestone structs
- [ ] Update createCampaign function to accept additional parameters
- [ ] Update addMilestone function to accept title and expected completion date

## Backend Setup
- [ ] Create backend/server.js with Express server, MongoDB connection, CORS, Multer
- [ ] Create backend/models/Campaign.js Mongoose schema
- [ ] Create backend/routes/campaigns.js for campaign creation API
- [ ] Install @pinata/sdk for IPFS integration
- [ ] Set up IPFS upload functionality in routes

## Frontend Updates
- [ ] Update frontend/src/components/CreateCampaign.js to include all new fields
- [ ] Add dynamic milestone fields based on number of milestones
- [ ] Add image upload functionality
- [ ] Update frontend/src/App.js to call backend API instead of contract directly

## Additional Tasks
- [ ] Update frontend/src/abi/Crowdfunding.json after contract changes
- [ ] Test the full campaign creation flow
- [ ] Deploy updated smart contract
