'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  UserPlus,
  MoreVertical,
  Shield,
  User,
  Mail,
  Calendar,
  Trash2,
  Edit,
  Crown,
  RefreshCw
} from 'lucide-react';

const UserCard = ({ user, onDelete, onChangeRole }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  const handleRoleChange = async () => {
    setChangingRole(true);
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await onChangeRole(user._id, newRole);
    } finally {
      setChangingRole(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user.role === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              }`}>
                {user.role === 'admin' ? (
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Admin
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    User
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
            >
              <button
                onClick={handleRoleChange}
                disabled={changingRole}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors disabled:opacity-50 ${
                  user.role === 'admin'
                    ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {changingRole ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : user.role === 'admin' ? (
                  <>
                    <User className="w-4 h-4" />
                    Make User
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    Make Admin
                  </>
                )}
              </button>
              <button
                onClick={() => onDelete(user._id)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        alert('Failed to delete user. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        alert('Failed to update user role. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('An error occurred while updating the user role.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'all' ||
                         (filterRole === 'admin' && user.role === 'admin') ||
                         (filterRole === 'user' && user.role === 'user');

    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-purple-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm md:text-base">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
          <button 
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm md:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
      >
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Administrators</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.adminUsers}</p>
            </div>
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Regular Users</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stats.regularUsers}</p>
            </div>
            <User className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-10 pr-8 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="user">Regular Users</option>
          </select>
        </div>
      </motion.div>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <UserCard
                user={user}
                onDelete={handleDeleteUser}
                onChangeRole={handleChangeRole}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterRole !== 'all' ? 'No users found' : 'No users registered yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterRole !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Users will appear here once they register'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsersPage;
