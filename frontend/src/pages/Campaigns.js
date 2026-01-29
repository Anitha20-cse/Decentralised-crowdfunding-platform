import React from "react";
import CampaignCard from "../components/CampaignCard";

function Campaigns({ campaigns, fundCampaign }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>All Campaigns</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px"
      }}>
        {campaigns.length === 0 && <p>No campaigns found</p>}

        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            fundCampaign={fundCampaign}
          />
        ))}
      </div>
    </div>
  );
}

export default Campaigns;
