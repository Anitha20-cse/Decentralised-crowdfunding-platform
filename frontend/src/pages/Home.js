import React, { useState } from "react";

function Home({ campaigns = [], createCampaign, fundCampaign }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");

  function handleCreate() {
    if (!title || !description || !goal || !days) {
      alert("All fields are required");
      return;
    }

    createCampaign(title, description, goal, days);

    // clear form
    setTitle("");
    setDescription("");
    setGoal("");
    setDays("");
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Create Campaign</h2>

      <input
        type="text"
        placeholder="Campaign Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Goal (ETH)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Duration (Days)"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate}>
        Create Campaign
      </button>

      <hr />

      <h2>All Campaigns</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found</p>
      ) : (
        campaigns.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p><b>Title:</b> {c.title}</p>
            <p><b>Description:</b> {c.description}</p>
            <p><b>Goal:</b> {c.goal} ETH</p>

            <button onClick={() => fundCampaign(c.id)}>
              Fund 0.01 ETH
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
