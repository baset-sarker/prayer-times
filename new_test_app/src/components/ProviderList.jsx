// src/components/ProviderList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

function ProviderList({ token, apiUrl }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }, // Add token to header
        });
        setProviders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching providers login first');
        if ([401, 403].includes(err.response?.status)) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [apiUrl, token]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this provider?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProviders(providers.filter((provider) => provider._id !== id)); // Update state after delete
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting provider');
    }
  };

  // if (loading) {
  //   return <div style={{color: 'white'}}> <img height={'30px'} src='/loading.gif'></img> Loading...</div>
  // }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="col-md-6 offset-md-3" style={{ minHeight: '800px' }}>
      {loading && <div style={{color: 'white',textAlign: 'center',marginTop:'10px'}}> <img height={'30px'} src='/loading.gif'></img> Loading...</div>}
      <h2 className="text-center" >Wifi Provider List</h2>
      <div className='my-4'>
        <Link to="/provider/create" className="btn-green mb-3">Create Provider</Link>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers?.map((provider) => (
            <tr key={provider._id}>
              <td>{provider.name}</td>
              <td>
                <Link to={`/provider/edit/${provider._id}`} className="btn btn-sm btn-warning">Edit</Link>
                <button onClick={() => handleDelete(provider._id)} className="btn btn-sm btn-danger ms-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* <ul className="list-group">
        {providers?.map((provider) => (
          <li key={provider._id} className="list-group-item">
            {provider.name}
            <Link to={`/provider/edit/${provider._id}`} className="btn btn-sm btn-warning ms-2">Edit</Link> 
            <button onClick={() => handleDelete(provider._id)} className="btn btn-sm btn-danger ms-2">Delete</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default ProviderList;