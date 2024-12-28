import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserListing.css'

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${baseURL}/api/admin/users`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          setError('Invalid response format. Expected an array of users.');
          setUsers([]);
        }
      } catch (error) {
        if (error.message === 'Network Error') {
          setError('Cannot connect to the server. Please make sure the backend server is running.');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/admin-login');
        } else {
          setError(`Error fetching users: ${error.message}`);
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleBlockUnblock = async (id, action) => {
    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirmAction) return;

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${baseURL}/api/admin/users/${id}/${action}`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: action === 'block' } : user
        )
      );
    } catch (error) {
      setError(`Error ${action}ing user: ${error.message}`);
    }
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="user-listing">
      <header>
        <h1>User Management</h1>
      </header>

      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {users.length > 0 ? (
        <table>
          <caption>User Listing</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td>
                  <button onClick={() => handleBlockUnblock(user._id, user.isBlocked ? 'unblock' : 'block')}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UserListing;
