import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Clock, Vote, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ElectionDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isVerified } = useAuth();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchElectionDetails();
  }, [id]);

  const fetchElectionDetails = async () => {
    try {
      const response = await axios.get(`/elections/${id}`);
      setElection(response.data.data.election);
      
      // Check if user has voted
      if (user?.votingHistory) {
        const voted = user.votingHistory.some(vote => 
          vote.electionId === response.data.data.election.blockchainElectionId
        );
        setHasVoted(voted);
      }
    } catch (error) {
      console.error('Failed to fetch election details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatus = () => {
    if (!election) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    const now = new Date();
    const start = new Date(election.startTime);
    const end = new Date(election.endTime);

    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    if (now >= start && now <= end) return { status: 'active', color: 'green', text: 'Active' };
    return { status: 'ended', color: 'gray', text: 'Ended' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = () => {
    if (!election) return '';
    
    const now = new Date();
    const end = new Date(election.endTime);
    const diff = end - now;

    if (diff <= 0) return 'Election has ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days, ${hours} hours remaining`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes remaining`;
    return `${minutes} minutes remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Not Found</h2>
          <p className="text-gray-600 mb-6">The election you're looking for doesn't exist.</p>
          <Link to="/elections" className="btn-primary">
            Back to Elections
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getElectionStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/elections"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Elections
          </Link>
        </div>

        {/* Election Header */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="badge badge-secondary">
                    {election.electionType}
                  </span>
                  <span className={`badge ${
                    statusInfo.color === 'green' ? 'badge-success' : 
                    statusInfo.color === 'blue' ? 'badge-primary' : 
                    'badge-secondary'
                  }`}>
                    {statusInfo.text}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {election.title}
                </h1>
                
                <p className="text-gray-600 text-lg mb-6">
                  {election.description}
                </p>

                {/* Election Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Start Time</p>
                      <p className="text-sm">{formatDate(election.startTime)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">End Time</p>
                      <p className="text-sm">{formatDate(election.endTime)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Candidates</p>
                      <p className="text-sm">{election.candidates?.length || 0} registered</p>
                    </div>
                  </div>
                  
                  {election.statistics?.totalVotes > 0 && (
                    <div className="flex items-center text-gray-600">
                      <Vote className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Total Votes</p>
                        <p className="text-sm">{election.statistics.totalVotes} cast</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Time Remaining */}
                {statusInfo.status === 'active' && (
                  <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg mb-6">
                    <Clock className="h-5 w-5 mr-3" />
                    <span className="font-medium">{getTimeRemaining()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="space-y-3">
                  {statusInfo.status === 'active' && (
                    <>
                      {!isAuthenticated ? (
                        <Link to="/login" className="btn-primary w-full text-center block">
                          Sign In to Vote
                        </Link>
                      ) : !isVerified() ? (
                        <Link to="/profile" className="btn-warning w-full text-center block">
                          Complete Verification
                        </Link>
                      ) : hasVoted ? (
                        <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span>You have voted</span>
                        </div>
                      ) : (
                        <Link
                          to={`/vote/${election._id}`}
                          className="btn-primary w-full text-center block"
                        >
                          Vote Now
                        </Link>
                      )}
                    </>
                  )}
                  
                  {statusInfo.status === 'ended' && (
                    <Link
                      to={`/results/${election._id}`}
                      className="btn-secondary w-full text-center block"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Requirements */}
        {statusInfo.status === 'active' && (
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Voting Requirements</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center">
                  {isAuthenticated ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span className={isAuthenticated ? 'text-green-700' : 'text-red-700'}>
                    User account required
                  </span>
                </div>
                
                <div className="flex items-center">
                  {user?.isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span className={user?.isVerified ? 'text-green-700' : 'text-red-700'}>
                    Email verification required
                  </span>
                </div>
                
                <div className="flex items-center">
                  {user?.isBlockchainVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span className={user?.isBlockchainVerified ? 'text-green-700' : 'text-red-700'}>
                    Blockchain wallet connected
                  </span>
                </div>
                
                <div className="flex items-center">
                  {!hasVoted ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                  )}
                  <span className={!hasVoted ? 'text-green-700' : 'text-yellow-700'}>
                    {hasVoted ? 'You have already voted' : 'Eligible to vote'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidates */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Candidates</h2>
          </div>
          <div className="card-body">
            {election.candidates && election.candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {election.candidates.map((candidate, index) => (
                  <div key={candidate.candidateId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-600">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {candidate.name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {candidate.description}
                        </p>
                        {candidate.party && (
                          <p className="text-sm text-gray-500">
                            <strong>Party:</strong> {candidate.party}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No candidates registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Election Rules */}
        {election.rules && Object.keys(election.rules).length > 0 && (
          <div className="card mt-8">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Election Rules</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {election.rules.eligibilityCriteria && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h3>
                    <p className="text-gray-600">{election.rules.eligibilityCriteria}</p>
                  </div>
                )}
                {election.rules.votingProcedure && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Voting Procedure</h3>
                    <p className="text-gray-600">{election.rules.votingProcedure}</p>
                  </div>
                )}
                {election.rules.disputeResolution && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Dispute Resolution</h3>
                    <p className="text-gray-600">{election.rules.disputeResolution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionDetail;
