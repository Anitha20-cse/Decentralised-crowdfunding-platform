import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abiJson from "../abi/Crowdfunding.json";

const CONTRACT_ADDRESS = "0x8008a865A6A157142E5D692A51c18e45B93F0c30";

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);

  async function loadCampaigns() {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      abiJson.abi ?? abiJson,
      provider
    );

    const count = await contract.campaignCount();
    const items = [];

    for (let i = 1; i <= count; i++) {
      const c = await contract.campaigns(i);

      items.push({
        id: i,
        creator: c.creator,
        title: c.title,
        description: c.description,
        goal: ethers.formatEther(c.goalAmount),
        collected: ethers.formatEther(c.totalCollected),
        deadline: new Date(Number(c.deadline) * 1000).toLocaleString(),
        active: c.active
      });
    }

    setCampaigns(items);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <div>
      <h2>Live Campaigns</h2>

      {campaigns.length === 0 && <p>No campaigns found</p>}

      {campaigns.map(c => (
        <div key={c.id} style={{
          border: "1px solid #ddd",
          padding: "16px",
          marginBottom: "12px",
          borderRadius: "10px"
        }}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p><b>Goal:</b> {c.goal} ETH</p>
          <p><b>Collected:</b> {c.collected} ETH</p>
          <p><b>Deadline:</b> {c.deadline}</p>
          <p><b>Status:</b> {c.active ? "Active" : "Closed"}</p>
        </div>
      ))}
    </div>
  );
}

export default CampaignList;
