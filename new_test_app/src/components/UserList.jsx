// src/components/UserList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

function UserList({ token, apiUrl }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }, // Add token to header
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users login first');
        if ([401, 403].includes(err.response?.status)) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [apiUrl, token]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id)); // Update state after delete
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  if (loading) {
    return <div style={{color: 'white'}}> <img height={'30px'} src='/loading.gif'></img> Loading...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="col-md-6 offset-md-3" style={{ minHeight: '800px' }}>
      <h2 className="text-center" >Admin List</h2>
      <div className='my-4'>
        {/* <Link to="/user/create" className="btn-green mb-3">Create User</Link> */}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                {/* <Link to={`/user/edit/${user._id}`} className="btn btn-sm btn-warning">Edit</Link> */}
                {/* <button onClick={() => handleDelete(user._id)} className="btn btn-sm btn-danger ms-2">Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default UserList;