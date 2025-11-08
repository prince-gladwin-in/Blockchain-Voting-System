const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("VotingSystem", function () {
  let VotingSystem;
  let votingSystem;
  let owner;
  let admin;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    [owner, admin, voter1, voter2, voter3] = await ethers.getSigners();
    VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingSystem.owner()).to.equal(owner.address);
    });

    it("Should set owner as admin", async function () {
      expect(await votingSystem.isAdmin(owner.address)).to.be.true;
    });
  });

  describe("Admin Management", function () {
    it("Should allow owner to add admin", async function () {
      await votingSystem.addAdmin(admin.address);
      expect(await votingSystem.isAdmin(admin.address)).to.be.true;
    });

    it("Should not allow non-owner to add admin", async function () {
      await expect(
        votingSystem.connect(voter1).addAdmin(admin.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to remove admin", async function () {
      await votingSystem.addAdmin(admin.address);
      await votingSystem.removeAdmin(admin.address);
      expect(await votingSystem.isAdmin(admin.address)).to.be.false;
    });
  });

  describe("Voter Registration", function () {
    it("Should allow voter registration", async function () {
      await votingSystem.connect(voter1).registerVoter("Alice");
      const voter = await votingSystem.getVoter(voter1.address);
      expect(voter.isRegistered).to.be.true;
      expect(voter.name).to.equal("Alice");
    });

    it("Should not allow duplicate registration", async function () {
      await votingSystem.connect(voter1).registerVoter("Alice");
      await expect(
        votingSystem.connect(voter1).registerVoter("Alice Again")
      ).to.be.revertedWith("Voter already registered");
    });

    it("Should allow admin to verify voter", async function () {
      await votingSystem.connect(voter1).registerVoter("Alice");
      await votingSystem.verifyVoter(voter1.address);
      const voter = await votingSystem.getVoter(voter1.address);
      expect(voter.isVerified).to.be.true;
    });
  });

  describe("Election Management", function () {
    let startTime;
    let endTime;

    beforeEach(async function () {
      const currentTime = await time.latest();
      startTime = currentTime + 3600; // 1 hour from now
      endTime = startTime + 86400; // 24 hours after start
    });

    it("Should create election", async function () {
      const tx = await votingSystem.createElection(
        "Presidential Election",
        "Choose the next president",
        startTime,
        endTime
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'ElectionCreated';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = votingSystem.interface.parseLog(event);
      const electionId = parsedEvent.args[0];

      const election = await votingSystem.elections(electionId);
      expect(election.title).to.equal("Presidential Election");
      expect(election.isActive).to.be.false;
    });

    it("Should add candidates to election", async function () {
      // Create election first
      const tx = await votingSystem.createElection(
        "Presidential Election",
        "Choose the next president",
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'ElectionCreated';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = votingSystem.interface.parseLog(event);
      const electionId = parsedEvent.args[0];
      
      // Add candidates
      await votingSystem.addCandidate(electionId, "Alice", "Candidate A");
      await votingSystem.addCandidate(electionId, "Bob", "Candidate B");

      // Get candidate IDs
      // Get election details
      const election = await votingSystem.elections(electionId);
      expect(election.totalVotes).to.equal(0);
      
      // Verify candidates were added by checking events
      const filter = votingSystem.filters.CandidateAdded(electionId);
      const events = await votingSystem.queryFilter(filter);
      expect(events.length).to.equal(2);
    });

    it("Should start election with candidates", async function () {
      // Create election
      const tx = await votingSystem.createElection(
        "Presidential Election",
        "Choose the next president",
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'ElectionCreated';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = votingSystem.interface.parseLog(event);
      const electionId = parsedEvent.args[0];

      // Add candidates
      await votingSystem.addCandidate(electionId, "Alice", "Candidate A");
      await votingSystem.addCandidate(electionId, "Bob", "Candidate B");

      // Fast forward to start time
      await time.increaseTo(startTime);
      
      // Start election
      await votingSystem.startElection(electionId);

      // Check if election is active
      const election = await votingSystem.elections(electionId);
      expect(election.isActive).to.be.true;
    });

    async function createTestElection() {
      const tx = await votingSystem.createElection(
        "Test Election",
        "Test Description",
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'ElectionCreated');
      return event?.args?.electionId;
    }
  });

  describe("Voting Process", function () {
    let electionId;
    let candidateId1;
    let candidateId2;
    let startTime;
    let endTime;

    beforeEach(async function () {
      const currentTime = await time.latest();
      startTime = currentTime + 100;
      endTime = startTime + 86400;

      // Create election
      const tx = await votingSystem.createElection(
        "Test Election",
        "Test Description",
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'ElectionCreated';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = votingSystem.interface.parseLog(event);
      electionId = parsedEvent.args[0];

      // Add candidates
      const tx1 = await votingSystem.addCandidate(electionId, "Alice", "Candidate A");
      const receipt1 = await tx1.wait();
      const event1 = receipt1.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'CandidateAdded';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent1 = votingSystem.interface.parseLog(event1);
      candidateId1 = parsedEvent1.args[1];

      const tx2 = await votingSystem.addCandidate(electionId, "Bob", "Candidate B");
      const receipt2 = await tx2.wait();
      const event2 = receipt2.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'CandidateAdded';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent2 = votingSystem.interface.parseLog(event2);
      candidateId2 = parsedEvent2.args[1];

      // Register and verify voters
      await votingSystem.connect(voter1).registerVoter("Voter 1");
      await votingSystem.connect(voter2).registerVoter("Voter 2");
      await votingSystem.verifyVoter(voter1.address);
      await votingSystem.verifyVoter(voter2.address);

      // Start election
      await time.increaseTo(startTime);
      await votingSystem.startElection(electionId);
    });

    it("Should allow verified voter to vote", async function () {
      await votingSystem.connect(voter1).vote(electionId, candidateId1);
      
      // Check if vote was cast by looking for VoteCast event
      const filter = votingSystem.filters.VoteCast(electionId);
      const events = await votingSystem.queryFilter(filter);
      expect(events.length).to.equal(1);

      // Check vote count through election data
      const election = await votingSystem.elections(electionId);
      expect(election.totalVotes).to.equal(1);
    });

    it("Should not allow double voting", async function () {
      await votingSystem.connect(voter1).vote(electionId, candidateId1);
      
      await expect(
        votingSystem.connect(voter1).vote(electionId, candidateId2)
      ).to.be.revertedWith("Voter has already voted");
    });

    it("Should not allow unregistered voter to vote", async function () {
      await expect(
        votingSystem.connect(voter3).vote(electionId, candidateId1)
      ).to.be.revertedWith("Voter not registered");
    });

    it("Should count votes correctly", async function () {
      await votingSystem.connect(voter1).vote(electionId, candidateId1);
      await votingSystem.connect(voter2).vote(electionId, candidateId1);

      const candidate = await votingSystem.getCandidate(electionId, candidateId1);
      expect(candidate.voteCount).to.equal(2);

      const election = await votingSystem.getElection(electionId);
      expect(election.totalVotes).to.equal(2);
    });
  });

  describe("Security", function () {
    it("Should prevent voting after election ends", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 100;
      const endTime = startTime + 1000;

      const tx = await votingSystem.createElection(
        "Test Election",
        "Test Description",
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'ElectionCreated';
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = votingSystem.interface.parseLog(event);
      const electionId = parsedEvent.args[0];

      // Add candidates
      await votingSystem.addCandidate(electionId, "Alice", "Candidate A");
      const candidateTx = await votingSystem.addCandidate(electionId, "Bob", "Candidate B");
      const candidateReceipt = await candidateTx.wait();
      const candidateEvent = candidateReceipt.logs.find(log => {
        try {
          const parsed = votingSystem.interface.parseLog(log);
          return parsed.name === 'CandidateAdded';
        } catch (e) {
          return false;
        }
      });
      const parsedCandidateEvent = votingSystem.interface.parseLog(candidateEvent);
      const candidateId = parsedCandidateEvent.args[1];

      await votingSystem.connect(voter1).registerVoter("Voter 1");
      await votingSystem.verifyVoter(voter1.address);

      await time.increaseTo(startTime);
      await votingSystem.startElection(electionId);

      // Fast forward past end time
      await time.increaseTo(endTime + 1);

      await expect(
        votingSystem.connect(voter1).vote(electionId, candidateId)
      ).to.be.revertedWith("Election has ended");
    });
  });
});
