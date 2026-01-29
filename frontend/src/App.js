import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import { useWallet } from "./context/WalletContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";

import CrowdfundingABI from "./abi/Crowdfunding.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x8008a865A6A157142E5D692A51c18e45B93F0c30";

function App() {
  const wallet = useWallet();
  const { address } = wallet || {};
  const [campaigns, setCampaigns] = useState([]);



  // ---------------- LOAD CAMPAIGNS ----------------
  async function loadCampaigns() {
    try {
      // Fetch from backend
      const backendResponse = await fetch('http://localhost:5000/campaigns');
      const backendCampaigns = await backendResponse.json();

      // Fetch from blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CrowdfundingABI,
        provider
      );

      const temp = [];

      for (const backendData of backendCampaigns) {
        try {
          const c = await contract.campaigns(backendData.campaignId);

          const createdAt = new Date(backendData.createdAt);
          const durationMs = backendData.durationInDays * 24 * 60 * 60 * 1000;
          const deadlineDate = new Date(createdAt.getTime() + durationMs);
          const now = new Date();
          const daysLeft = Math.max(0, Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)));

          temp.push({
            id: backendData.campaignId,
            title: backendData.title,
            imageUrl: backendData.images && backendData.images.length > 0 ? `http://localhost:5000/uploads/${backendData.images[0]}` : '',
            creatorName: backendData.creatorName,
            creatorAddress: backendData.creatorAddress,
            goal: parseFloat(backendData.goalAmount),
            collected: parseFloat(ethers.formatEther(c.totalCollected)),
            deadline: deadlineDate.toISOString(),
            supportersCount: 0, // Placeholder, as blockchain doesn't track individual funders easily
            daysLeft,
            progressPercent: (parseFloat(ethers.formatEther(c.totalCollected)) / parseFloat(backendData.goalAmount)) * 100,
            shortDescription: backendData.shortDescription,
            detailedDescription: backendData.detailedDescription,
            creatorRole: backendData.creatorRole,
            causeCategory: backendData.causeCategory,
            createdAt: backendData.createdAt,
          });
        } catch (blockchainError) {
          console.warn(`Blockchain data not found for campaign ID ${backendData.campaignId}, skipping:`, blockchainError);
          // Skip campaigns that don't exist on blockchain
        }
      }

      setCampaigns(temp);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
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
    const creatorAddress = address; // Add creatorAddress from wallet

    // Add creatorAddress to formData
    formData.append('creatorAddress', creatorAddress);

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

    // Add milestones to blockchain if any
    if (backendData.milestones && backendData.milestones.length > 0) {
      for (let i = 0; i < backendData.milestones.length; i++) {
        const milestone = backendData.milestones[i];
        const milestoneTx = await contract.addMilestone(
          backendData.campaignId,
          milestone.title,
          milestone.description,
          ethers.parseEther(milestone.amount.toString()),
          Math.floor(new Date(milestone.expectedCompletionDate).getTime() / 1000)
        );
        await milestoneTx.wait();
      }
    }

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
  }, [address]);

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

        {/* Campaign Details */}
        <Route
          path="/campaign/:id"
          element={<CampaignDetails campaigns={campaigns} fundCampaign={fundCampaign} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
