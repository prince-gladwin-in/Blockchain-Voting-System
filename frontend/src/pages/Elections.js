import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Vote, Check, AlertTriangle, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pagination, setPagination] = useState({});
  const [updates, setUpdates] = useState([]);
  const { isAuthenticated } = useAuth();

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Upcoming: 'bg-blue-100 text-blue-800',
    Ended: 'bg-gray-100 text-gray-800'
  };

  const statusIcons = {
    Active: <Check className="w-4 h-4" />,
    Upcoming: <Clock className="w-4 h-4" />,
    Ended: <AlertTriangle className="w-4 h-4" />
  };

  const electionTypes = ['Presidential', 'Parliamentary', 'Local', 'Referendum', 'Other'];

  useEffect(() => {
    fetchElections();
    fetchUpdates();
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchElections = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await axios.get(`/api/elections?${params}`);
      setElections(response.data.elections || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('/api/elections/updates');
      setUpdates(response.data || []);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-repeat pattern-blockchain"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
            FirstVote Elections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participate in secure, transparent elections powered by blockchain technology
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 bg-white bg-opacity-90 rounded-lg shadow-sm p-4 flex justify-around items-center backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {elections.filter(e => e.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-500">Active Elections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {elections.length}
            </div>
            <div className="text-sm text-gray-500">Total Elections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              1,234,567
            </div>
            <div className="text-sm text-gray-500">Registered Voters</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-6 bg-white bg-opacity-90 p-4 rounded-lg shadow-sm backdrop-blur-sm">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="Active">🟢 Active</option>
              <option value="Upcoming">🕓 Upcoming</option>
              <option value="Ended">⚪ Ended</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex-shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              {electionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Elections Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {elections.map((election) => (
              <div 
                key={election._id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden backdrop-blur-sm bg-opacity-90"
              >
                <div className="p-6">
                  {/* Type Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {election.type}
                    </span>
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {election.title}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[election.status]} shadow-sm`}>
                      {statusIcons[election.status]}
                      <span className="ml-1">{election.status}</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600 line-clamp-2">{election.description}</p>
                    
                    {/* Timeline */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(election.startTime).toLocaleDateString()} - {new Date(election.endTime).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: election.status === 'Active' ? '60%' : 
                                  election.status === 'Ended' ? '100%' : '0%' 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Parties Grid */}
                    {election.parties && election.parties.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {election.parties.map(party => (
                          <div 
                            key={party.name} 
                            className="group/party relative flex items-center bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                            title={`${party.name}\nParty Leader: ${party.leader || 'Not specified'}`}
                          >
                            {party.logo && (
                              <img 
                                src={party.logo} 
                                alt={`${party.name} logo`}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="ml-2 text-sm text-gray-700 truncate">{party.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-3">
                      <Link
                        to={`/elections/${election._id}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-primary-300 shadow-sm text-sm font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      
                      {election.status === 'Active' && isAuthenticated && (
                        <Link
                          to={`/vote/${election._id}`}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Vote Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>        {/* Latest Updates */}
        <div className="mt-12 relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🗞️</span> Latest Updates in India
          </h2>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-opacity-90">
            <div className="divide-y divide-gray-200">
              {updates.map((update, index) => (
                <div 
                  key={update._id}
                  className="p-4 hover:bg-gray-50 transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <img 
                        src="/india-map-icon.png" 
                        alt="India"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary-600 mb-1">
                        {update.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {update.content}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(update.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Election Button */}
        {isAuthenticated && (
          <Link
            to="/elections/create"
            className="fixed bottom-8 right-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
          >
            <Vote className="w-5 h-5 mr-2" />
            Create Election
          </Link>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {Array.from({ length: pagination.totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => fetchElections(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pagination.currentPage === index + 1
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elections;