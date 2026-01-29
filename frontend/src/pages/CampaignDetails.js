import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import CrowdfundingABI from "../abi/Crowdfunding.json";
import { useWallet } from "../context/WalletContext";

const CONTRACT_ADDRESS = "0x8008a865A6A157142E5D692A51c18e45B93F0c30";

function CampaignDetails({ campaigns, fundCampaign }) {
  const { id } = useParams();
  const { provider, address } = useWallet();
  const [campaign, setCampaign] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [amount, setAmount] = useState("");
  const [creatorAddress, setCreatorAddress] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:5000/campaigns/${id}`);
        const data = await response.json();
        setCampaign(data);
        setCreatorAddress(data.creatorAddress);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      }
    };

    const fetchMilestones = async () => {
      if (provider) {
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdfundingABI, provider);
          const milestoneCount = await contract.getMilestoneCount(parseInt(id));
          const fetchedMilestones = [];

          for (let i = 0; i < milestoneCount; i++) {
            const milestone = await contract.getMilestone(parseInt(id), i);
            fetchedMilestones.push({
              title: milestone[0],
              description: milestone[1],
              amount: ethers.formatEther(milestone[2]),
              expectedCompletionDate: new Date(Number(milestone[3]) * 1000).toISOString().split('T')[0],
              yesVotes: Number(milestone[4]),
              noVotes: Number(milestone[5]),
              completed: milestone[6]
            });
          }

          setMilestones(fetchedMilestones);
        } catch (error) {
          console.error('Error fetching milestones:', error);
        }
      }
    };

    fetchCampaign();
    fetchMilestones();
  }, [id, provider]);

  const handleFund = () => {
    if (amount) {
      fundCampaign(parseInt(id), amount);
      setAmount("");
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{campaign.title}</h1>
      {campaign.images && campaign.images.length > 0 && (
        <img
          src={`http://localhost:5000/uploads/${campaign.images[0]}`}
          alt={campaign.title}
          style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }}
        />
      )}
      <p><strong>Creator:</strong> {campaign.creatorName} ({campaign.creatorRole})</p>
      <p><strong>Category:</strong> {campaign.causeCategory}</p>
      <p><strong>Short Description:</strong> {campaign.shortDescription}</p>
      <p><strong>Detailed Description:</strong> {campaign.detailedDescription}</p>
      <p><strong>Goal:</strong> {campaign.goalAmount} ETH</p>
      <p><strong>Duration:</strong> {campaign.durationInDays} days</p>
      <p><strong>Created At:</strong> {new Date(campaign.createdAt).toLocaleDateString()}</p>

      {/* Milestones Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Milestones</h3>
        {console.log('Rendering milestones:', milestones)}
        {milestones && milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <div key={index} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              backgroundColor: "#f9f9f9"
            }}>
              <h4>Milestone {index + 1}: {milestone.title}</h4>
              <p><strong>Description:</strong> {milestone.description}</p>
              <p><strong>Target Amount:</strong> {milestone.amount} ETH</p>
              <p><strong>Expected Completion:</strong> {new Date(milestone.expectedCompletionDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No milestones for this campaign.</p>
        )}
      </div>

      {/* Contribution Section */}
      {!address ? (
        <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffeaa7" }}>
          <p style={{ margin: 0, color: "#856404" }}>
            Please connect your wallet to contribute to this campaign.
          </p>
        </div>
      ) : !creatorAddress ? (
        <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#e9ecef", borderRadius: "8px", border: "1px solid #ced4da" }}>
          <p style={{ margin: 0, color: "#6c757d" }}>
            Loading campaign details...
          </p>
        </div>
      ) : address.toLowerCase() === creatorAddress.toLowerCase() ? (
        <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #dee2e6" }}>
          <p style={{ margin: 0, color: "#6c757d" }}>
            <strong>Note:</strong> As the creator of this campaign, you cannot contribute to your own campaign.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <button onClick={handleFund} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>
            Contribute
          </button>
        </div>
      )}
    </div>
  );
}

export default CampaignDetails;
