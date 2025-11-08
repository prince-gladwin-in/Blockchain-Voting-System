import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Vote as VoteIcon, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users,
  Shield,
  Info,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';

const Vote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { web3, contract, currentAccount: account } = useWeb3();
  const { user } = useAuth();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voterDetails, setVoterDetails] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    voterId: ''
  });
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);

  useEffect(() => {
    fetchElectionData();
  }, [id]);

  const fetchElectionData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch election details
      const electionRes = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/elections/${id}`,
        config
      );

      setElection(electionRes.data.data.election);
      setCandidates(electionRes.data.data.election.candidates || []);

      // Check if user has already voted
      if (contract && account) {
        try {
          const voted = await contract.methods.hasVoted(
            electionRes.data.data.election.blockchainElectionId,
            account
          ).call();
          setHasVoted(voted);
        } catch (error) {
          console.error('Error checking vote status:', error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching election:', error);
      toast.error('Failed to load election data');
      setLoading(false);
    }
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!voterDetails.fullName || !voterDetails.email || !voterDetails.phone || 
        !voterDetails.address || !voterDetails.voterId) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(voterDetails.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(voterDetails.phone.replace(/[-\s]/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setDetailsSubmitted(true);
    toast.success('Details submitted successfully. Please select a candidate to vote.');
  };

  const handleCandidateSelect = (candidate) => {
    if (hasVoted) {
      toast.error('You have already voted in this election');
      return;
    }
    setSelectedCandidate(candidate);
  };

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate before voting');
      return;
    }

    if (!detailsSubmitted) {
      toast.error('Please submit your details first');
      return;
    }

    if (!account) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted in this election');
      return;
    }

    setSubmitting(true);

    try {
      // Submit vote to blockchain
      const receipt = await contract.methods.vote(
        election.blockchainElectionId,
        selectedCandidate.candidateId
      ).send({ from: account });

      // Record vote in backend
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/blockchain/vote`,
        {
          electionId: id,
          candidateId: selectedCandidate.candidateId,
          transactionHash: receipt.transactionHash,
          voterDetails: voterDetails
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Vote cast successfully!');
      setHasVoted(true);
      
      // Redirect to results after 2 seconds
      setTimeout(() => {
        navigate(`/results/${id}`);
      }, 2000);

    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error(error.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election...</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Not Found</h2>
          <p className="text-gray-600 mb-4">The election you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/elections')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View All Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Election Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
              <p className="text-gray-600 mb-4">{election.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Ends: {new Date(election.endTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{candidates.length} Candidates</span>
                </div>
              </div>
            </div>
            
            {hasVoted && (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">Already Voted</span>
              </div>
            )}
          </div>
        </div>

        {/* Voter Details Form */}
        {!detailsSubmitted && !hasVoted && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Voter Details</h2>
            </div>
            <p className="text-gray-600 mb-6">Please fill in your details before voting. All fields are mandatory.</p>
            
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={voterDetails.fullName}
                    onChange={(e) => setVoterDetails({ ...voterDetails, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={voterDetails.email}
                    onChange={(e) => setVoterDetails({ ...voterDetails, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={voterDetails.phone}
                    onChange={(e) => setVoterDetails({ ...voterDetails, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voter ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={voterDetails.voterId}
                    onChange={(e) => setVoterDetails({ ...voterDetails, voterId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your voter ID"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={voterDetails.address}
                    onChange={(e) => setVoterDetails({ ...voterDetails, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Submit Details & Proceed to Vote
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        )}

        {/* Candidates Selection */}
        {(detailsSubmitted || hasVoted) && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {hasVoted ? 'Candidates' : 'Select Your Candidate'}
              </h2>
              {!hasVoted && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Important:</p>
                      <p className="text-sm text-yellow-700">
                        You can only vote for ONE candidate. Once submitted, your vote cannot be changed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.candidateId}
                    onClick={() => !hasVoted && handleCandidateSelect(candidate)}
                    className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedCandidate?.candidateId === candidate.candidateId
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    } ${hasVoted ? 'cursor-not-allowed opacity-75' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{candidate.name}</h3>
                        {candidate.party && (
                          <p className="text-sm text-indigo-600 font-semibold mb-2">{candidate.party}</p>
                        )}
                      </div>
                      {selectedCandidate?.candidateId === candidate.candidateId && !hasVoted && (
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{candidate.description}</p>
                    {candidate.voteCount !== undefined && (
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">Votes:</span> {candidate.voteCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vote Confirmation */}
            {!hasVoted && selectedCandidate && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Confirm Your Vote</h3>
                    <p className="text-gray-600">You have selected: <span className="font-semibold">{selectedCandidate.name}</span></p>
                  </div>
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Voter Details:</strong>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Name:</strong> {voterDetails.fullName}</p>
                    <p><strong>Email:</strong> {voterDetails.email}</p>
                    <p><strong>Phone:</strong> {voterDetails.phone}</p>
                    <p><strong>Voter ID:</strong> {voterDetails.voterId}</p>
                  </div>
                </div>

                <button
                  onClick={handleVoteSubmit}
                  disabled={submitting || !account}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Vote...
                    </>
                  ) : (
                    <>
                      <VoteIcon className="w-5 h-5 mr-2" />
                      Cast Your Vote
                    </>
                  )}
                </button>

                {!account && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    Please connect your wallet to cast your vote
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Vote;
