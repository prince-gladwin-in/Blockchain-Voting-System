import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Edit, 
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, filterRole, filterVerified, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const params = new URLSearchParams({
        page: pagination.current,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole && { role: filterRole }),
        ...(filterVerified && { isVerified: filterVerified })
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users?${params}`,
        config
      );

      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${userId}/verify`,
        {},
        config
      );

      toast.success('User verified successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${userId}/role`,
        { role: newRole },
        config
      );

      toast.success('User role updated successfully');
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${userId}/status`,
        { isActive: !currentStatus },
        config
      );

      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const UserModal = ({ user, onClose }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Edit User</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Information
              </label>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                <p className="text-sm"><strong>Username:</strong> {user.username}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateRole(user._id, selectedRole)}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-2 text-gray-600">View and manage all registered users</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Roles</option>
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {user.isVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-500" title="Verified" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" title="Not Verified" />
                        )}
                        {user.isBlockchainVerified && (
                          <Shield className="w-5 h-5 text-blue-500" title="Blockchain Verified" />
                        )}
                        {!user.isActive && (
                          <span className="text-xs text-red-600 font-semibold">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.walletAddress ? (
                        <span className="font-mono text-xs">
                          {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(38)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not connected</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!user.isVerified && (
                          <button
                            onClick={() => handleVerifyUser(user._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Verify User"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit User"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                disabled={pagination.current === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                disabled={pagination.current === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.current - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                    disabled={pagination.current === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {pagination.current} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                    disabled={pagination.current === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <UserModal user={selectedUser} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminUsers;
