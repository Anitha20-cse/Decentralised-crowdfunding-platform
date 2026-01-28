import React from "react";
import CampaignList from "../components/CampaignList";

function Campaigns({ campaigns, fundCampaign }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>All Campaigns</h2>

      <CampaignList
        campaigns={campaigns}
        fundCampaign={fundCampaign}
      />
    </div>
  );
}

export default Campaigns;
