import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import { useWallet } from "./context/WalletContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";

import CrowdfundingABI from "./abi/Crowdfunding.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x259fB55444Ee31891758D4be8593e4A621D4D575";

function App() {
  const wallet = useWallet();
  const { address } = wallet || {};
  const [campaigns, setCampaigns] = useState([]);



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
  async function createCampaign(formData) {
    // Extract fields for blockchain
    const title = formData.get('title');
    const description = formData.get('shortDescription'); // Use shortDescription as description for blockchain
    const creatorName = formData.get('creatorName');
    const creatorRole = formData.get('creatorRole');
    const causeCategory = formData.get('causeCategory');
    const goal = formData.get('goalAmount');
    const days = formData.get('durationInDays');

    // First, save to backend
    const backendResponse = await fetch('http://localhost:5000/campaigns', {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      alert('Failed to save campaign to backend');
      return;
    }

    const backendData = await backendResponse.json();
    console.log('Backend response:', backendData);

    // Then, create on blockchain
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
      creatorName,
      creatorRole,
      causeCategory,
      ethers.parseEther(goal),
      parseInt(days)
    );

    await tx.wait();
    alert("Campaign Created Successfully!");

    await loadCampaigns(); // refresh list
  }

  // ---------------- FUND CAMPAIGN ----------------
  async function fundCampaign(id, amount) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CrowdfundingABI,
      signer
    );

    const tx = await contract.fundCampaign(id, {
      value: ethers.parseEther(amount),
    });

    await tx.wait();
    alert("Funded Successfully!");

    loadCampaigns(); // refresh
  }

  // ---------------- AUTO LOAD ----------------
  useEffect(() => {
    if (window.ethereum) {
      loadCampaigns();
    }
  }, []);

  // ---------------- UI ----------------
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Landing + Create Campaign */}
        <Route
          path="/"
          element={<Home createCampaign={createCampaign} account={address} campaigns={campaigns} />}
        />

        {/* View All Campaigns */}
        <Route
          path="/campaigns"
          element={
            <Campaigns
              campaigns={campaigns}
              fundCampaign={fundCampaign}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
