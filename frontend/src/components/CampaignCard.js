import React from "react";

function CampaignCard({ campaign, fundCampaign }) {
  return (
    <div className="card">
      <h3>{campaign.title}</h3>
      <p>Goal: {campaign.goal} ETH</p>
      <p>Raised: {campaign.raised} ETH</p>
      <button onClick={() => fundCampaign(campaign.id)}>
        Fund Campaign
      </button>
    </div>
  );
}

export default CampaignCard;
