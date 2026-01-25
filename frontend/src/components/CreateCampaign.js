import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi/Crowdfunding.json";

const contractAddress = "0xDBb6E41312DfA650935a833F1FA773dce7907213";

function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");

  async function createCampaign() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.createCampaign(
      title,
      description,
      ethers.parseEther(goal),
      days
    );

    await tx.wait();
    alert("Campaign Created Successfully!");
  }

  return (
    <div className="card">
      <h2>Create Campaign</h2>

      <input
        placeholder="Campaign Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Goal (ETH)"
        onChange={(e) => setGoal(e.target.value)}
      />

      <input
        placeholder="Duration (Days)"
        onChange={(e) => setDays(e.target.value)}
      />

      <button onClick={createCampaign}>Create Campaign</button>
    </div>
  );
}

export default CreateCampaign;
