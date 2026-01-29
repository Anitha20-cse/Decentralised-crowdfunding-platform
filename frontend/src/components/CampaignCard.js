import React from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";

function CampaignCard({ campaign, fundCampaign }) {
  const navigate = useNavigate();
  const { address } = useWallet();

  console.log('CampaignCard - Campaign ID:', campaign.id, 'Creator Address:', campaign.creatorAddress, 'Current Address:', address);
  console.log('Creator Address type:', typeof campaign.creatorAddress, 'Current Address type:', typeof address);
  const isCreator = address && campaign.creatorAddress && address.toLowerCase() === campaign.creatorAddress.toLowerCase();
  console.log('Is creator:', isCreator, 'Comparison:', address?.toLowerCase(), '===', campaign.creatorAddress?.toLowerCase());

  const handleContribute = () => {
    if (address && campaign.creatorAddress && address.toLowerCase() === campaign.creatorAddress.toLowerCase()) {
      alert("As the creator of this campaign, you cannot contribute to your own campaign.");
      return;
    }
    const amount = prompt("Enter amount in ETH:");
    if (amount) {
      fundCampaign(campaign.id, amount);
    }
  };

  const handleViewDetails = () => {
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <div style={{
      width: "320px",
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Image Section */}
      <div style={{
        width: "100%",
        height: "200px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px 12px 0 0",
        overflow: "hidden"
      }}>
        {campaign.imageUrl ? (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>No Image</span>
        )}
      </div>

      {/* Content Section */}
      <div style={{ padding: "16px" }}>
        {/* Title and Creator */}
        <h3 style={{
          fontSize: "18px",
          fontWeight: "bold",
          margin: "0 0 8px 0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "1.2"
        }}>
          {campaign.title}
        </h3>
        <p style={{
          fontSize: "14px",
          color: "#666",
          margin: "0 0 16px 0"
        }}>
          by {campaign.creatorName}
        </p>

        {/* Fund Progress */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            marginBottom: "8px"
          }}>
            <span style={{ fontWeight: "bold" }}>
              {campaign.collected.toFixed(2)} ETH raised
            </span>
            <span style={{ color: "#666" }}>
              of {campaign.goal.toFixed(2)} ETH
            </span>
          </div>
          <div style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "4px"
          }}>
            <div style={{
              width: `${Math.min(campaign.progressPercent, 100)}%`,
              height: "100%",
              backgroundColor: "#28a745",
              borderRadius: "4px"
            }}></div>
          </div>
          <div style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "right"
          }}>
            {campaign.progressPercent.toFixed(1)}% funded
          </div>
        </div>

        {/* Meta Details */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          color: "#666",
          marginBottom: "16px"
        }}>
          <span>{campaign.daysLeft} days left</span>
          <span>{campaign.supportersCount} supporters</span>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          {!(address && campaign.creatorAddress && address.toLowerCase() === campaign.creatorAddress.toLowerCase()) && (
            <button
              onClick={handleContribute}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
              }}
            >
              Contribute
            </button>
          )}
          <button
            onClick={handleViewDetails}
            style={{
              flex: address && campaign.creatorAddress && address.toLowerCase() === campaign.creatorAddress.toLowerCase() ? "1" : "1",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              color: "#007bff",
              border: "1px solid #007bff",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;
