// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Crowdfunding {

    // ---------- DATA STRUCTURES ----------

    struct Milestone {
        string description;
        uint256 amount;
        uint256 yesVotes;
        uint256 noVotes;
        bool completed;
        mapping(address => bool) voted;
    }

    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goalAmount;
        uint256 totalCollected;
        uint256 deadline;
        bool active;
        uint256 milestoneCount;
        mapping(uint256 => Milestone) milestones;
        mapping(address => uint256) contributions;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    // ---------- EVENTS ----------

    event CampaignCreated(uint256 campaignId, address creator);
    event Funded(uint256 campaignId, address contributor, uint256 amount);
    event MilestoneCreated(uint256 campaignId, uint256 milestoneId);
    event Voted(uint256 campaignId, uint256 milestoneId, bool vote);
    event Withdrawn(uint256 campaignId, uint256 milestoneId, uint256 amount);
    event Refunded(uint256 campaignId, address contributor, uint256 amount);

    // ---------- MODIFIERS ----------

    modifier onlyCreator(uint256 _id) {
        require(msg.sender == campaigns[_id].creator, "Not campaign creator");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id < campaignCount, "Campaign does not exist");
        _;
    }

    // ---------- CORE FUNCTIONS ----------

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _durationInDays
    ) external {
        Campaign storage c = campaigns[campaignCount];
        c.creator = payable(msg.sender);
        c.title = _title;
        c.description = _description;
        c.goalAmount = _goalAmount;
        c.deadline = block.timestamp + (_durationInDays * 1 days);
        c.active = true;

        emit CampaignCreated(campaignCount, msg.sender);
        campaignCount++;
    }

    function addMilestone(
        uint256 _campaignId,
        string memory _description,
        uint256 _amount
    ) external campaignExists(_campaignId) onlyCreator(_campaignId) {
        Campaign storage c = campaigns[_campaignId];

        Milestone storage m = c.milestones[c.milestoneCount];
        m.description = _description;
        m.amount = _amount;

        emit MilestoneCreated(_campaignId, c.milestoneCount);
        c.milestoneCount++;
    }

    function fundCampaign(uint256 _campaignId) external payable campaignExists(_campaignId) {
        Campaign storage c = campaigns[_campaignId];

        require(block.timestamp < c.deadline, "Campaign ended");
        require(msg.value > 0, "Zero contribution");

        c.totalCollected += msg.value;
        c.contributions[msg.sender] += msg.value;

        emit Funded(_campaignId, msg.sender, msg.value);
    }

    function voteOnMilestone(
        uint256 _campaignId,
        uint256 _milestoneId,
        bool _approve
    ) external campaignExists(_campaignId) {
        Campaign storage c = campaigns[_campaignId];
        Milestone storage m = c.milestones[_milestoneId];

        require(c.contributions[msg.sender] > 0, "Not a contributor");
        require(!m.voted[msg.sender], "Already voted");
        require(!m.completed, "Milestone completed");

        m.voted[msg.sender] = true;

        if (_approve) {
            m.yesVotes++;
        } else {
            m.noVotes++;
        }

        emit Voted(_campaignId, _milestoneId, _approve);
    }

    function withdrawMilestoneFunds(
        uint256 _campaignId,
        uint256 _milestoneId
    ) external campaignExists(_campaignId) onlyCreator(_campaignId) {
        Campaign storage c = campaigns[_campaignId];
        Milestone storage m = c.milestones[_milestoneId];

        require(!m.completed, "Already withdrawn");
        require(m.yesVotes > m.noVotes, "Milestone not approved");
        require(address(this).balance >= m.amount, "Insufficient balance");

        m.completed = true;
        c.creator.transfer(m.amount);

        emit Withdrawn(_campaignId, _milestoneId, m.amount);
    }

    function refund(uint256 _campaignId) external campaignExists(_campaignId) {
        Campaign storage c = campaigns[_campaignId];

        require(block.timestamp > c.deadline, "Campaign still active");
        require(c.totalCollected < c.goalAmount, "Goal met");
        require(c.contributions[msg.sender] > 0, "No contribution");

        uint256 amount = c.contributions[msg.sender];
        c.contributions[msg.sender] = 0;

        payable(msg.sender).transfer(amount);

        emit Refunded(_campaignId, msg.sender, amount);
    }
}
