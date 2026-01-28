import React, { useState } from "react";

function CreateCampaign({ createCampaign }) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorRole, setCreatorRole] = useState("");
  const [causeCategory, setCauseCategory] = useState("");
  const [numMilestones, setNumMilestones] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [images, setImages] = useState([]);

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  async function handleCreate() {
    if (!title || !shortDescription || !detailedDescription || !goal || !days || !creatorName || !creatorRole || !causeCategory) {
      alert("Please fill all required fields");
      return;
    }
    if (isNaN(goal) || parseFloat(goal) <= 0) {
      alert("Goal must be a positive number");
      return;
    }
    if (isNaN(days) || parseInt(days) <= 0) {
      alert("Duration must be a positive integer");
      return;
    }
    if (numMilestones > 0 && milestones.length !== numMilestones) {
      alert("Please fill all milestone details");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('shortDescription', shortDescription);
    formData.append('detailedDescription', detailedDescription);
    formData.append('goalAmount', goal);
    formData.append('durationInDays', days);
    formData.append('creatorName', creatorName);
    formData.append('creatorRole', creatorRole);
    formData.append('causeCategory', causeCategory);
    formData.append('numMilestones', numMilestones);
    formData.append('milestones', JSON.stringify(milestones));
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    await createCampaign(formData);
    // Reset form
    setTitle("");
    setShortDescription("");
    setDetailedDescription("");
    setGoal("");
    setDays("");
    setCreatorName("");
    setCreatorRole("");
    setCauseCategory("");
    setNumMilestones(0);
    setMilestones([]);
    setImages([]);
  }

  return (
    <div className="card">
      <h2>Create Campaign</h2>

      <input
        placeholder="Campaign Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Short Description (1-2 lines)"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
      />

      <textarea
        placeholder="Detailed Description"
        value={detailedDescription}
        onChange={(e) => setDetailedDescription(e.target.value)}
        rows="4"
      />

      <input
        placeholder="Goal (ETH)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <input
        placeholder="Duration (Days)"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <input
        placeholder="Creator Name / Organization Name"
        value={creatorName}
        onChange={(e) => setCreatorName(e.target.value)}
      />

      <select value={creatorRole} onChange={(e) => setCreatorRole(e.target.value)}>
        <option value="">Select Creator Role</option>
        <option value="NGO">NGO</option>
        <option value="Individual">Individual</option>
        <option value="Community Group">Community Group</option>
        <option value="Trust / Foundation">Trust / Foundation</option>
      </select>

      <select value={causeCategory} onChange={(e) => setCauseCategory(e.target.value)}>
        <option value="">Select Cause Category</option>
        <option value="Education">Education</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Environment">Environment</option>
        <option value="Women Empowerment">Women Empowerment</option>
        <option value="Rural Development">Rural Development</option>
        <option value="Disaster Relief">Disaster Relief</option>
        <option value="Animal Welfare">Animal Welfare</option>
        <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
      </select>

      <input
        type="number"
        placeholder="Number of Milestones"
        value={numMilestones}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (isNaN(value) || value < 0) {
            setNumMilestones(0);
            setMilestones([]);
          } else {
            setNumMilestones(value);
            setMilestones(Array(value).fill({}));
          }
        }}
      />

      {milestones.map((milestone, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h4>Milestone {index + 1}</h4>
          <input
            placeholder="Milestone Title"
            value={milestone.title || ''}
            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={milestone.description || ''}
            onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
            rows="2"
          />
          <input
            placeholder="Target Amount (ETH)"
            value={milestone.amount || ''}
            onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
          />
          <input
            type="date"
            placeholder="Expected Completion Date"
            value={milestone.expectedCompletionDate || ''}
            onChange={(e) => handleMilestoneChange(index, 'expectedCompletionDate', e.target.value)}
          />
        </div>
      ))}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

      <button onClick={handleCreate}>Create Campaign</button>
    </div>
  );
}

export default CreateCampaign;
