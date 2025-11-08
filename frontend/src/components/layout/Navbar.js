import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Vote, User, Settings, LogOut, Shield, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isConnected, currentAccount, connectMetaMask, formatAddress } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const handleConnectWallet = async () => {
    await connectMetaMask();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', href: '/', public: true },
    { name: 'Elections', href: '/elections', public: true },
    { name: 'Dashboard', href: '/dashboard', protected: true },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'Manage Elections', href: '/admin/elections', icon: Vote },
    { name: 'Manage Users', href: '/admin/users', icon: User },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl group-hover:scale-105 transition-transform duration-200">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  FirstVote
                </span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                if (item.admin && !isAdmin()) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-3">
            {/* Wallet connection */}
            {isAuthenticated && (
              <div className="flex items-center">
                {isConnected ? (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-success-50 text-success-700 rounded-full text-sm font-medium border border-success-200">
                    <Wallet className="h-4 w-4" />
                    <span>{formatAddress(currentAccount)}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectWallet}
                    className="flex items-center space-x-2 px-4 py-2 bg-warning-50 text-warning-700 rounded-full text-sm font-medium hover:bg-warning-100 transition-all duration-200 border border-warning-200"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </button>
                )}
              </div>
            )}

            {isAuthenticated ? (
              /* Profile dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-3 py-2 text-sm rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        {user?.email}
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Link>
                      
                      {isAdmin() && (
                        <>
                          <div className="border-t border-gray-100"></div>
                          {adminNavigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.name}
                            </Link>
                          ))}
                        </>
                      )}
                      
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              if (item.admin && !isAdmin()) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1">
                {/* Wallet status */}
                <div className="px-4 py-2">
                  {isConnected ? (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Wallet className="h-4 w-4" />
                      <span>Wallet: {formatAddress(currentAccount)}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectWallet}
                      className="flex items-center space-x-2 text-sm text-yellow-600 hover:text-yellow-700"
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Connect Wallet</span>
                    </button>
                  )}
                </div>
                
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile Settings
                </Link>
                
                {isAdmin() && adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
