import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CampaignList from "./components/CampaignList";
import CrowdfundingABI from "./abi/Crowdfunding.json";
import "./App.css";

const CONTRACT_ADDRESS = "0xDBb6E41312DfA650935a833F1FA773dce7907213";

function App() {
  const [account, setAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  async function connectWallet() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  }

  // ---------------- LOAD CAMPAIGNS ----------------
  async function loadCampaigns() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CrowdfundingABI,
    provider
  );

  const count = await contract.campaignCount();
  const temp = [];

  for (let i = 0; i < count; i++) {
    const c = await contract.campaigns(i);

    temp.push({
      id: i,
      creator: c.creator,
      title: c.title,
      description: c.description,
      goal: ethers.formatEther(c.goalAmount),
      collected: ethers.formatEther(c.totalCollected),
      deadline: c.deadline.toString(),
    });
  }

  setCampaigns(temp);
}

  // ---------------- CREATE CAMPAIGN ----------------
async function createCampaign(title, description, goal, days) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CrowdfundingABI,
    signer
  );

  const tx = await contract.createCampaign(
    title,
    description,
    ethers.parseEther(goal),
    days
  );

  await tx.wait();
  alert("Campaign Created!");

  // 🔴 THIS IS THE KEY LINE
  await loadCampaigns();
}


  // ---------------- FUND CAMPAIGN ----------------
  async function fundCampaign(id, amount) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CrowdfundingABI.abi ?? CrowdfundingABI,
      signer
    );

    const tx = await contract.fundCampaign(id, {
      value: ethers.parseEther(amount),
    });
    await tx.wait();

    alert("Funded!");
    loadCampaigns(); // 🔥 refresh list
  }

  // ---------------- AUTO LOAD ----------------
 // ---------------- AUTO LOAD ----------------
useEffect(() => {
  if (window.ethereum) {
    loadCampaigns();
  }
}, []);

  // ---------------- UI ----------------
  return (
    <>
      <Navbar connectWallet={connectWallet} account={account} />

      <Home createCampaign={createCampaign} />

      <CampaignList
        campaigns={campaigns}
        fundCampaign={fundCampaign}
      />
    </>
  );
}

export default App;
