import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCampaign from "../components/CreateCampaign";
import CampaignCard from "../components/CampaignCard";

function Home({ createCampaign, account, campaigns }) {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

  function goToCampaigns() {
    navigate("/campaigns");
  }

  if (!account) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h1>GreenFund</h1>

        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          A decentralized crowdfunding platform empowering social welfare,
          education, environment, and community-driven projects using blockchain
          technology.
        </p>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Please connect your wallet to get started.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>GreenFund</h1>

        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          A decentralized crowdfunding platform empowering social welfare,
          education, environment, and community-driven projects using blockchain
          technology.
        </p>

        <button
          style={{
            margin: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create Campaign"}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <CreateCampaign createCampaign={createCampaign} account={account} />
          {console.log('Home - Passing account to CreateCampaign:', account)}
        </div>
      )}

      <h2 style={{ textAlign: "center" }}>Active Campaigns</h2>

      {campaigns.length === 0 && (
        <p style={{ textAlign: "center" }}>No campaigns found</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            fundCampaign={() => {}} // Placeholder, as funding is handled on details page
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
