# TODO for Crowdfunding App Modifications

## Issue 1: Contribute Option Visibility
- The contribute option should only be visible for accounts other than the campaign creator.
- Currently, creatorAddress is not being saved in the backend, causing the check to fail and show contribute for everyone.

### Tasks:
- [ ] Update `frontend/src/App.js` to include `creatorAddress` in the formData when creating a campaign.
- [ ] Update `backend/routes/campaigns.js` to destructure and save `creatorAddress` in the Campaign model.

## Issue 2: Milestone Display
- Milestones are not displaying properly on the campaign details page, even though they were added during creation.
- Possible causes: Fetch from blockchain failing, data not parsed correctly, or contract issues.

### Tasks:
- [ ] Investigate and fix milestone fetching in `frontend/src/pages/CampaignDetails.js`.
- [ ] Ensure milestone data is correctly added to blockchain in `frontend/src/App.js`.
- [ ] Add error handling and logging for milestone operations.

## General:
- [ ] Test the changes to ensure contribute option is hidden for creators and milestones display correctly.
