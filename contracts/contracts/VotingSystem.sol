// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VotingSystem
 * @dev A secure, transparent voting system smart contract
 */
contract VotingSystem is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
        bool exists;
    }

    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool exists;
        mapping(uint256 => Candidate) candidates;
        mapping(address => bool) hasVoted;
        uint256[] candidateIds;
        uint256 totalVotes;
    }

    struct Voter {
        address voterAddress;
        bool isRegistered;
        bool isVerified;
        string name;
        uint256 registrationTime;
    }

    // State variables
    Counters.Counter private _electionIds;
    Counters.Counter private _candidateIds;
    
    mapping(uint256 => Election) public elections;
    mapping(address => Voter) public voters;
    mapping(address => bool) public authorizedAdmins;
    
    uint256[] public activeElectionIds;
    
    // Events
    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);
    event VoterRegistered(address indexed voter, string name);
    event VoterVerified(address indexed voter);
    event ElectionStarted(uint256 indexed electionId);
    event ElectionEnded(uint256 indexed electionId);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    // Modifiers
    modifier onlyAdmin() {
        require(authorizedAdmins[msg.sender] || msg.sender == owner(), "Not authorized admin");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        require(voters[msg.sender].isVerified, "Voter not verified");
        _;
    }

    modifier validElection(uint256 _electionId) {
        require(elections[_electionId].exists, "Election does not exist");
        _;
    }

    modifier electionActive(uint256 _electionId) {
        require(elections[_electionId].isActive, "Election is not active");
        require(block.timestamp >= elections[_electionId].startTime, "Election has not started");
        require(block.timestamp <= elections[_electionId].endTime, "Election has ended");
        _;
    }

    constructor() {
        authorizedAdmins[msg.sender] = true;
        emit AdminAdded(msg.sender);
    }

    /**
     * @dev Add a new admin
     */
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid admin address");
        require(!authorizedAdmins[_admin], "Already an admin");
        
        authorizedAdmins[_admin] = true;
        emit AdminAdded(_admin);
    }

    /**
     * @dev Remove an admin
     */
    function removeAdmin(address _admin) external onlyOwner {
        require(authorizedAdmins[_admin], "Not an admin");
        require(_admin != owner(), "Cannot remove owner");
        
        authorizedAdmins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    /**
     * @dev Register a new voter
     */
    function registerVoter(string memory _name) external {
        require(!voters[msg.sender].isRegistered, "Voter already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        voters[msg.sender] = Voter({
            voterAddress: msg.sender,
            isRegistered: true,
            isVerified: false,
            name: _name,
            registrationTime: block.timestamp
        });
        
        emit VoterRegistered(msg.sender, _name);
    }

    /**
     * @dev Verify a registered voter (admin only)
     */
    function verifyVoter(address _voter) external onlyAdmin {
        require(voters[_voter].isRegistered, "Voter not registered");
        require(!voters[_voter].isVerified, "Voter already verified");
        
        voters[_voter].isVerified = true;
        emit VoterVerified(_voter);
    }

    /**
     * @dev Create a new election
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyAdmin returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        
        _electionIds.increment();
        uint256 newElectionId = _electionIds.current();
        
        Election storage newElection = elections[newElectionId];
        newElection.id = newElectionId;
        newElection.title = _title;
        newElection.description = _description;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.isActive = false;
        newElection.exists = true;
        newElection.totalVotes = 0;
        
        emit ElectionCreated(newElectionId, _title, _startTime, _endTime);
        return newElectionId;
    }

    /**
     * @dev Add a candidate to an election
     */
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _description
    ) external onlyAdmin validElection(_electionId) returns (uint256) {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(!elections[_electionId].isActive, "Cannot add candidates to active election");
        
        _candidateIds.increment();
        uint256 newCandidateId = _candidateIds.current();
        
        elections[_electionId].candidates[newCandidateId] = Candidate({
            id: newCandidateId,
            name: _name,
            description: _description,
            voteCount: 0,
            exists: true
        });
        
        elections[_electionId].candidateIds.push(newCandidateId);
        
        emit CandidateAdded(_electionId, newCandidateId, _name);
        return newCandidateId;
    }

    /**
     * @dev Start an election
     */
    function startElection(uint256 _electionId) external onlyAdmin validElection(_electionId) {
        require(!elections[_electionId].isActive, "Election already active");
        require(elections[_electionId].candidateIds.length >= 2, "Need at least 2 candidates");
        require(block.timestamp >= elections[_electionId].startTime, "Election start time not reached");
        
        elections[_electionId].isActive = true;
        activeElectionIds.push(_electionId);
        
        emit ElectionStarted(_electionId);
    }

    /**
     * @dev End an election
     */
    function endElection(uint256 _electionId) external onlyAdmin validElection(_electionId) {
        require(elections[_electionId].isActive, "Election not active");
        
        elections[_electionId].isActive = false;
        
        // Remove from active elections
        for (uint256 i = 0; i < activeElectionIds.length; i++) {
            if (activeElectionIds[i] == _electionId) {
                activeElectionIds[i] = activeElectionIds[activeElectionIds.length - 1];
                activeElectionIds.pop();
                break;
            }
        }
        
        emit ElectionEnded(_electionId);
    }

    /**
     * @dev Cast a vote
     */
    function vote(uint256 _electionId, uint256 _candidateId) 
        external 
        onlyRegisteredVoter 
        validElection(_electionId) 
        electionActive(_electionId) 
        nonReentrant 
    {
        require(!elections[_electionId].hasVoted[msg.sender], "Voter has already voted");
        require(elections[_electionId].candidates[_candidateId].exists, "Candidate does not exist");
        
        elections[_electionId].hasVoted[msg.sender] = true;
        elections[_electionId].candidates[_candidateId].voteCount++;
        elections[_electionId].totalVotes++;
        
        emit VoteCast(_electionId, _candidateId, msg.sender);
    }

    // View functions
    
    /**
     * @dev Get election details
     */
    function getElection(uint256 _electionId) external view validElection(_electionId) returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 totalVotes
    ) {
        Election storage election = elections[_electionId];
        return (
            election.id,
            election.title,
            election.description,
            election.startTime,
            election.endTime,
            election.isActive,
            election.totalVotes
        );
    }

    /**
     * @dev Get candidate details
     */
    function getCandidate(uint256 _electionId, uint256 _candidateId) 
        external 
        view 
        validElection(_electionId) 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            uint256 voteCount
        ) 
    {
        require(elections[_electionId].candidates[_candidateId].exists, "Candidate does not exist");
        Candidate storage candidate = elections[_electionId].candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.description, candidate.voteCount);
    }

    /**
     * @dev Get all candidates for an election
     */
    function getElectionCandidates(uint256 _electionId) 
        external 
        view 
        validElection(_electionId) 
        returns (uint256[] memory) 
    {
        return elections[_electionId].candidateIds;
    }

    /**
     * @dev Check if voter has voted in an election
     */
    function hasVoted(uint256 _electionId, address _voter) 
        external 
        view 
        validElection(_electionId) 
        returns (bool) 
    {
        return elections[_electionId].hasVoted[_voter];
    }

    /**
     * @dev Get voter details
     */
    function getVoter(address _voter) external view returns (
        bool isRegistered,
        bool isVerified,
        string memory name,
        uint256 registrationTime
    ) {
        Voter storage voter = voters[_voter];
        return (voter.isRegistered, voter.isVerified, voter.name, voter.registrationTime);
    }

    /**
     * @dev Get active elections
     */
    function getActiveElections() external view returns (uint256[] memory) {
        return activeElectionIds;
    }

    /**
     * @dev Get total number of elections
     */
    function getTotalElections() external view returns (uint256) {
        return _electionIds.current();
    }

    /**
     * @dev Check if address is admin
     */
    function isAdmin(address _address) external view returns (bool) {
        return authorizedAdmins[_address] || _address == owner();
    }
}
