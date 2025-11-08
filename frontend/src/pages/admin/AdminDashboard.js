import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Vote, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Shield,
  Activity
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, verified: 0, active: 0, blockchainVerified: 0 },
    elections: { total: 0, active: 0, upcoming: 0, completed: 0 }
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentElections, setRecentElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch user stats
      const userStatsRes = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/stats/overview`,
        config
      );

      // Fetch recent users
      const usersRes = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users?limit=5`,
        config
      );

      // Fetch elections
      const electionsRes = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/elections?limit=5`,
        config
      );

      setStats({
        users: {
          total: userStatsRes.data.data.overview.totalUsers,
          verified: userStatsRes.data.data.overview.verifiedUsers,
          active: userStatsRes.data.data.overview.activeUsers,
          blockchainVerified: userStatsRes.data.data.overview.blockchainVerifiedUsers
        },
        elections: {
          total: electionsRes.data.data.pagination.total,
          active: electionsRes.data.data.elections.filter(e => e.status === 'active').length,
          upcoming: electionsRes.data.data.elections.filter(e => e.status === 'scheduled').length,
          completed: electionsRes.data.data.elections.filter(e => e.status === 'ended').length
        }
      });

      setRecentUsers(usersRes.data.data.users);
      setRecentElections(electionsRes.data.data.elections);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage elections, users, and monitor system activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.users.total}
            subtitle={`${stats.users.verified} verified`}
            color="text-blue-600"
          />
          <StatCard
            icon={CheckCircle}
            title="Verified Users"
            value={stats.users.verified}
            subtitle={`${stats.users.blockchainVerified} blockchain verified`}
            color="text-green-600"
          />
          <StatCard
            icon={Vote}
            title="Total Elections"
            value={stats.elections.total}
            subtitle={`${stats.elections.active} active`}
            color="text-purple-600"
          />
          <StatCard
            icon={Activity}
            title="Active Elections"
            value={stats.elections.active}
            subtitle={`${stats.elections.upcoming} upcoming`}
            color="text-orange-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/elections/create"
              className="flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Create New Election
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Manage Users
            </Link>
            <Link
              to="/admin/elections"
              className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Vote className="w-5 h-5 mr-2" />
              View All Elections
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <Link to="/admin/users" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.isVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {user.isBlockchainVerified && (
                        <Shield className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No users yet</p>
              )}
            </div>
          </div>

          {/* Recent Elections */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Elections</h2>
              <Link to="/admin/elections" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentElections.length > 0 ? (
                recentElections.map((election) => (
                  <div key={election._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{election.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        election.status === 'active' ? 'bg-green-100 text-green-800' :
                        election.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {election.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{election.description?.substring(0, 80)}...</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(election.startTime).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No elections yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
