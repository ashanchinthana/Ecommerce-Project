import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../api/userApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import {
  SearchIcon,
  PencilIcon,
  TrashIcon,
  UserAddIcon,
  FilterIcon,
} from '@heroicons/react/outline';
import { UserIcon } from '@heroicons/react/solid';
import UserForm from '../../components/admin/UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    isAdmin: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load users
  const loadUsers = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page,
        limit: 10,
        ...filters,
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      const response = await getAllUsers(queryParams);
      setUsers(response.users);
      setTotalPages(Math.ceil(response.pagination.totalCount / 10));
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    loadUsers(1, filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      isAdmin: '',
    });
    setSearchTerm('');
    loadUsers(1, {});
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    loadUsers(page, filters);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const promptDelete = (userId) => {
    setConfirmDelete(userId);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete);
      toast.success('User deleted successfully');
      setConfirmDelete(null);
      loadUsers(currentPage);
    } catch (err) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditUser(null);
    loadUsers(currentPage);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditUser(null);
  };

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    try {
      await updateUser(userId, { isAdmin: !currentIsAdmin });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isAdmin: !currentIsAdmin } 
          : user
      ));
      
      toast.success(`User role updated successfully`);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <UserForm
              user={editUser}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              User Management
            </h1>
            <button
              onClick={() => {
                setEditUser(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserAddIcon className="h-5 w-5 mr-2" />
              Add New User
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearch} className="flex w-full md:w-auto mb-4 md:mb-0">
                <div className="relative flex-grow mr-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Search
                </button>
              </form>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                <FilterIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User Role
                    </label>
                    <select
                      id="isAdmin"
                      name="isAdmin"
                      value={filters.isAdmin}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">All Users</option>
                      <option value="true">Admins</option>
                      <option value="false">Regular Users</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center">
                <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</div>
                <button
                  onClick={() => loadUsers(1)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Registered
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {user.avatar ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {user._id.substring(user._id.length - 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.addresses && user.addresses.length > 0 
                                ? user.addresses[0].phone 
                                : 'No phone'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                              className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                                user.isAdmin
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              }`}
                            >
                              {user.isAdmin ? 'Admin' : 'Customer'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                              aria-label="Edit user"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => promptDelete(user._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              aria-label="Delete user"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                            No users found. Try a different search or filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {/* Page numbers */}
                          {[...Array(totalPages).keys()].map((page) => {
                            const pageNumber = page + 1;
                            // Show current page, first and last page, and one page before and after current
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              pageNumber === currentPage ||
                              pageNumber === currentPage - 1 ||
                              pageNumber === currentPage + 1
                            ) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`relative inline-flex items-center px-4 py-2 border ${
                                    currentPage === pageNumber
                                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:border-primary-500 dark:text-primary-300'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                                  } text-sm font-medium`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            }
                            
                            // Show ellipsis for gaps
                            if (
                              (pageNumber === 2 && currentPage > 3) ||
                              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return (
                                <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                  ...
                                </span>
                              );
                            }
                            
                            return null;
                          })}
                          
                          <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;