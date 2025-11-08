import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Clock, CheckCircle, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';

const Dashboard = () => {
  const { user, isVerified } = useAuth();
  const { isConnected, currentAccount, formatAddress } = useWeb3();
  const [elections, setElections] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [electionsRes, activeRes] = await Promise.all([
        axios.get('/elections?limit=5'),
        axios.get('/elections/active')
      ]);
      
      setElections(electionsRes.data.data.elections || []);
      setStats({
        totalElections: electionsRes.data.data.pagination?.total || 0,
        activeElections: activeRes.data.data.elections?.length || 0,
        userVotes: user?.votingHistory?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const start = new Date(election.startTime);
    const end = new Date(election.endTime);

    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    if (now >= start && now <= end) return { status: 'active', color: 'green', text: 'Active' };
    return { status: 'ended', color: 'gray', text: 'Ended' };
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your voting activities
          </p>
        </div>

        {/* Verification Status */}
        {(!user?.isVerified || !user?.isBlockchainVerified || !isConnected) && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  Complete Your Setup
                </h3>
                <div className="space-y-2 text-sm text-yellow-700">
                  {!user?.isVerified && (
                    <p>• Email verification required</p>
                  )}
                  {!user?.isBlockchainVerified && (
                    <p>• Blockchain verification needed</p>
                  )}
                  {!isConnected && (
                    <p>• Connect your wallet to participate in voting</p>
                  )}
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center mt-3 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700"
                >
                  Complete Setup
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Vote className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Elections</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalElections}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Elections</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeElections}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Your Votes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.userVotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        {isConnected && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">
                  Wallet Connected
                </h3>
                <p className="text-sm text-green-700">
                  Address: {formatAddress(currentAccount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Elections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Recent Elections</h2>
            </div>
            <div className="card-body">
              {elections.length > 0 ? (
                <div className="space-y-4">
                  {elections.slice(0, 5).map((election) => {
                    const statusInfo = getElectionStatus(election);
                    return (
                      <div key={election._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{election.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {election.electionType} • {election.candidates?.length || 0} candidates
                          </p>
                          <div className="flex items-center mt-2">
                            <span className={`badge badge-${statusInfo.color === 'blue' ? 'primary' : statusInfo.color === 'green' ? 'success' : 'secondary'}`}>
                              {statusInfo.text}
                            </span>
                            {statusInfo.status === 'active' && (
                              <span className="text-sm text-gray-500 ml-2">
                                {formatTimeRemaining(election.endTime)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {statusInfo.status === 'active' && isVerified() ? (
                            <Link
                              to={`/vote/${election._id}`}
                              className="btn-primary btn-sm"
                            >
                              Vote
                            </Link>
                          ) : (
                            <Link
                              to={`/elections/${election._id}`}
                              className="btn-outline btn-sm"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No elections available</p>
                </div>
              )}
            </div>
            <div className="card-footer">
              <Link
                to="/elections"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View all elections →
              </Link>
            </div>
          </div>

          {/* Voting History */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Your Voting History</h2>
            </div>
            <div className="card-body">
              {user?.votingHistory && user.votingHistory.length > 0 ? (
                <div className="space-y-4">
                  {user.votingHistory.slice(0, 5).map((vote, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          Election #{vote.electionId}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Voted on {new Date(vote.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          Tx: {vote.transactionHash.slice(0, 10)}...
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No voting history yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Participate in elections to see your voting history
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/elections"
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="card-body text-center">
              <Vote className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Browse Elections</h3>
              <p className="text-sm text-gray-600">
                Discover and participate in ongoing elections
              </p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="card-body text-center">
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-sm text-gray-600">
                Manage your account and verification status
              </p>
            </div>
          </Link>

          <div className="card">
            <div className="card-body text-center">
              <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Election Results</h3>
              <p className="text-sm text-gray-600">
                View results from completed elections
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
